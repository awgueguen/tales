const Input = (props) => {
    const { name, handleChange, value, type} = props;
    return (
        <>
          <label htmlFor={name}>Type to change your {name}</label>
          <input 
            name={name}
            value={value}
            onChange={handleChange}
            type={type ? type : "text"}
            placeholder={value}
          >
          </input>
        </>
    )
}

export default Input