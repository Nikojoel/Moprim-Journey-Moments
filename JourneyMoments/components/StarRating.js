import React, {useState, useEffect} from 'react'
import StarRating from 'react-native-star-rating'
import {Content, H2} from 'native-base'
import {Button} from 'react-native'

const Stars = ({handleStars}) => {
    const [speed, setSpeed] = useState(0)
    const [cleanness, setCleanness] = useState(0)
    const [comfort, setComfort] = useState(0)

    return (
        <Content>
            <H2>Speed</H2>
            <StarRating
                disabled={false}
                maxStars={5}
                rating={speed}
                selectedStar={(rating) => setSpeed(rating)}
                fullStarColor={'yellow'}
            />
            <H2>Cleanness</H2>
            <StarRating
                disabled={false}
                maxStars={5}
                rating={comfort}
                selectedStar={(rating) => setComfort(rating)}
                fullStarColor={'yellow'}
            />
            <H2>Comfort</H2>
            <StarRating
                disabled={false}
                maxStars={5}
                rating={cleanness}
                selectedStar={(rating) => setCleanness(rating)}
                fullStarColor={'yellow'}
            />
            <Button title="Send" onPress={() => {
                handleStars({speed: speed, cleanness: cleanness, comfort: comfort})
            }}/>
        </Content>
    )
}

export default Stars
