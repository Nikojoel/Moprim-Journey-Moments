import React, {useState, useEffect} from 'react'
import {Text} from "react-native"

const Comment = ({data}) => {
    console.log("data in comment", data)
    return (
        <Text>{data.text}</Text>
    )
}

export default Comment
