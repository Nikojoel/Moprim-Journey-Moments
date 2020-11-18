const loginConstraints = {
    email: {
        email: {
            message: 'is not valid.',
        },
    },

    password: {
        length: {
            minimum: 5,
            message: 'must be atleast 5 characters',
        },
    },
};

export {
    loginConstraints,
};