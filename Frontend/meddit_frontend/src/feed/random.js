import React from 'react';
import { useLocation } from 'react-router-dom'

const SayHi = () => {
    const location = useLocation();
    console.log(location.state.data.postID);
    return (
        <h1>Hello</h1>
    )
}

export default SayHi