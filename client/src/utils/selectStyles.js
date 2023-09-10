export const selectStylesSmall = {
    control: (baseStyles, state) => ({
        ...baseStyles,
        width: 100,
        height: 50,
        borderColor: state.isFocused ? '#000' : '#d4d4d4',
        border: '1px solid #d4d4d4',
        cursor: 'pointer',
        margin: '1rem 0 0 0',
        fontSize: '.8rem',
        fontWeight: 600
    }),
    menu: (base) => ({
        ...base,
        marginTop: 0,
        fontSize: '.8rem'
    }),
    option: (base) => ({
        ...base,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    })
}

export const selectStylesLarge = {
    control: (baseStyles, state) => ({
        ...baseStyles,
        height: 50,
        borderColor: state.isFocused ? '#000' : '#d4d4d4',
        border: '1px solid #d4d4d4',
        cursor: 'pointer',
        margin: '1rem 0 0 0',
        fontSize: '1rem',
        fontWeight: 500
    }),
    menu: (base) => ({
        ...base,
        marginTop: 0,
        fontSize: '.9rem'
    }),
    option: (base) => ({
        ...base,
        height: 45,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    })
}

export const theme = theme => ({
    ...theme,
    colors: {
        ...theme.colors,
        primary25: "#f3f3f3",
        primary: "#1EBA54"
    }
});