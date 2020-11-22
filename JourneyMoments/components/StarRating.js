import React, { useState, useEffect } from 'react'
import StarRating from 'react-native-star-rating'
import { Content, H2, Right, Text, View, Left } from 'native-base'
import { Button, StyleSheet } from 'react-native'


const Stars = ({ handleStars, rating, owner }) => {
    const [speed, setSpeed] = useState(0)
    const [cleanness, setCleanness] = useState(0)
    const [comfort, setComfort] = useState(0)

    useEffect(()=> {
        setSpeed(rating.speed)
        setCleanness(rating.cleanness)
        setComfort(rating.comfort)
    },[rating])
        
    
    return (
        <Content>
            <View style={styles.row}>
                <Text style={styles.text}>Speed</Text>
                <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={speed}
                    selectedStar={(rating) => setSpeed(rating)}
                    fullStarColor={'yellow'}
                    starSize={20}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>Comfort</Text>
                <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={comfort}
                    selectedStar={(rating) => setComfort(rating)}
                    fullStarColor={'yellow'}
                    starSize={20}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>Cleanness</Text>
                <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={cleanness}
                    selectedStar={(rating) => setCleanness(rating)}
                    fullStarColor={'yellow'}
                    starSize={20}
                />
            </View>
            {owner &&  <Button title="rate" onPress={() => {
                handleStars({ speed: speed, cleanness: cleanness, comfort: comfort })
            }} />}
           
        </Content>
    )
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'column'
    },
    text: {
        textAlign: 'center'
    },

})

export default Stars
