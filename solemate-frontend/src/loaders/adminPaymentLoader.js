// adminPaymentsLoader.js
import { paymentApiService } from '../services/paymentapi.js';

// Loader function for AdminPayments
export async function adminPaymentsLoader({ request }) {
    try {
      const url = new URL(request.url);
      const searchParams = url.searchParams;
      
      // Extract filters from URL search params
      const filters = {
        page: parseInt(searchParams.get('page') || '1'),
        status: searchParams.get('status') || null,
        search: searchParams.get('search') || null,
      };
      
      // Fetch both paginated payments for display and all payments for stats
      const [paymentsResponse, allPaymentsResponse] = await Promise.all([
        paymentApiService.getAllPayments(
          filters.page, 
          10, // limit per page
          filters.status,
          filters.search
        ),
        paymentApiService.getAllPaymentsForStats().catch(() => ({ data: { payments: [] } })) // Fallback if fails
      ]);
      
      const paymentsData = paymentsResponse.data;
      const allPaymentsData = allPaymentsResponse.data;
      
      // Calculate stats from ALL payments (not just current page)
      let allPayments = allPaymentsData.payments || allPaymentsData.data || [];
      const stats = {
        total: allPayments.length,
        completed: allPayments.filter(p => p.status === 'COMPLETED').length,
        pending: allPayments.filter(p => p.status === 'PENDING').length,
        failed: allPayments.filter(p => p.status === 'FAILED').length,
        cancelled: allPayments.filter(p => p.status === 'CANCELLED').length,
        refunded: allPayments.filter(p => p.status === 'REFUNDED').length
      };
      
      // Calculate pagination based on all payments and current filters
      let allPayments2 = allPaymentsData.payments || allPaymentsData.data || [];
      
      // Calculate how many items match current filters
      let filteredCount = allPayments.length;
      if (filters.status || filters.search) {
        filteredCount = allPayments2.filter(payment => {
          let matches = true;
          
          if (filters.status) {
            matches = matches && payment.status === filters.status;
          }
          
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            matches = matches && (
              payment.payment_id?.toLowerCase().includes(searchLower) ||
              payment.order_o_id?.toLowerCase().includes(searchLower) ||
              payment.user_id?.toLowerCase().includes(searchLower) ||
              payment.payment_amount?.toString().includes(searchLower)
            );
          }
          
          return matches;
        }).length;
      }
      
      // Create proper pagination object
      const pagination = {
        current_page: filters.page,
        total_pages: Math.ceil(filteredCount / 10),
        total_items: filteredCount,
        items_per_page: 10
      };
      
      return {
        payments: paymentsData.payments || paymentsData.data || [],
        pagination,
        stats,
        filters
      };
      
    } catch (error) {
      console.error('Error loading admin payments:', error);
      
      // Return empty data structure to prevent crashes
      return {
        payments: [],
        pagination: {
          current_page: 1,
          total_pages: 0,
          total_items: 0,
          items_per_page: 10
        },
        stats: {
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          cancelled: 0,
          refunded: 0
        },
        filters: {}
      };
    }
  }