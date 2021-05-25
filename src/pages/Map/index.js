import React, { useState, useEffect } from 'react';
import { Container, MapTextContainer, MapText, CalloutContainer, CalloutText, Footer, Button, Text } from './styles';
import { StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome5 } from '@expo/vector-icons';
import mapMarker from '../../assets/icone_marker.png';

export default function Map({ navigation }) {
    const [isLoading, setIsLoading] = useState(true);
    const [currentLatitude, setLatitude] = useState(0);
    const [currentLongitude, setLongitude] = useState(0);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            const location = await Location.getCurrentPositionAsync({ accuracy: 6 });
            setLatitude(location.coords.latitude);
            setLongitude(location.coords.longitude);
            setIsLoading(false);
        })();
    }, []);

    function handleNavigateToInfo() {
        navigation.navigate('Info');
    }

    function handleNavigateToSelectArea() {
        navigation.navigate('SelectArea');
    }

    return (
        <Container>
            {isLoading ? (
                <MapTextContainer>
                    <MapText>Carregando mapa...</MapText>
                </MapTextContainer>
            ) : (
                <MapView style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={{
                    latitude: currentLatitude,
                    longitude: currentLongitude,
                    latitudeDelta: 0.0143,
                    longitudeDelta: 0.0143
                }}
                >
                    <Marker
                        icon={mapMarker}
                        coordinate={{
                            latitude: currentLatitude,
                            longitude: currentLongitude
                        }}
                    >
                        <Callout tooltip onPress={handleNavigateToInfo}>
                            <CalloutContainer>
                                <CalloutText>Universidade Federal Rural de Pernambuco</CalloutText>
                            </CalloutContainer>
                        </Callout>
                    </Marker>
                </MapView>
            )}
            <Footer>
                <Button onPress={handleNavigateToSelectArea}>
                    <FontAwesome5 name='plus' size={22} color='white' />
                    <Text>Instituição</Text>
                </Button>
            </Footer>
        </Container>
    );
}

const styles = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
})