const FormInput = ({ label, name, type, defaultValue, size }) => {
    return (
      <div className="form-control w-full">
        <label htmlFor={name} className="label">
          <span className="label-text capitalize font-medium text-stone-700">
            {label}
          </span>
        </label>
        <input
          type={type}
          name={name}
          id={name}
          defaultValue={defaultValue}
          className={`input input-bordered border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white text-stone-800 placeholder-stone-400 ${size || 'w-full'}`}
          placeholder={`Enter your ${label}`}
          required
        />
      </div>
    );
  };
  
  export default FormInput;