import {useContext, useState} from 'react';
import validate from 'validate.js';

const useSignUpForm = (constraints = {}) => {
    // Hooks
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});

    // Sets username FormTextInput value
    const handleUsernameChange = (text) => {
        setInputs((inputs) =>
            ({
                ...inputs,
                username: text,
            }));
    };

    // Sets password FormTextInput value
    const handlePasswordChange = (text) => {
        setInputs((inputs) =>
            ({
                ...inputs,
                password: text,
            }));
    };


    // Sets email FormTextInput value
    const handleEmailChange = (text) => {
        setInputs((inputs) =>
            ({
                ...inputs,
                email: text,
            }));
    };


    // Validates input values and displays error badges if validation fails
    const validateField = (attr) => {
        const attrName = Object.keys(attr).pop(); // Get the only or last item from array
        const valResult = validate(attr, constraints);
        let valid = undefined;
        if (valResult[attrName]) {
            valid = valResult[attrName][0]; // Get just the first message
        }
        // Error badges
        setErrors((errors) =>
            ({
                ...errors,
                [attrName]: valid,
                fetch: undefined,
            }));
    };

    // Check if username is already in use
    const checkAvail = async () => {
        const text = inputs.username;
        try {
            // API call to check username availability
            const result = await fetchAPI('GET', 'users/username', text);
            // Set error badge if username is taken
            if (!result.available) {
                setErrors((errors) =>
                    ({
                        ...errors,
                        username: 'Username not available.',
                    }));
            }
        } catch (e) {
            // Error badges for the API call failing
            setErrors((errors) =>
                ({
                    ...errors,
                    fetch: e.message,
                }));
        }
    };

    // Validates user input before sending an API call
    const validateOnSend = (fields) => {
        // Iterate over all user input
        for (const [key, value] of Object.entries(fields)) {
            validateField(value);
        }
        // Return validated inputs
        return !(errors.username !== undefined ||
            errors.email !== undefined ||
            errors.password !== undefined)
    };

    // Returns
    return {
        handleUsernameChange,
        handlePasswordChange,
        handleEmailChange,
        checkAvail,
        validateField,
        validateOnSend,
        inputs,
        errors,
        setErrors,
        setInputs,
    };
};

export default useSignUpForm;