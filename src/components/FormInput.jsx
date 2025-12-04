import React from "react";

export default function FormInput({ 
  id, 
  type = "text", 
  label, 
  value, 
  onChange, 
  placeholder, 
  icon: Icon, 
  rightElement, 
  required = true 
}) {
  return (
    <div className="relative mb-6">
      <label htmlFor={id} className="absolute -top-2.5 left-3 px-1 text-xs text-gray-300 bg-[#5A746B] z-10">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 bg-transparent border-2 border-gray-500 rounded-lg focus:outline-none focus:border-blue-400 transition-colors text-white placeholder-gray-500"
        placeholder={placeholder}
      />
      {Icon && (
        <Icon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      )}
      
      {rightElement && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightElement}
        </div>
      )}
    </div>
  );
}