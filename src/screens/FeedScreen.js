import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Button, View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, RefreshControl } from 'react-native';
import { ListItem } from 'react-native-elements';
import serverAPI from '../api/server';

const FeedScreen = (props) => {

    const [feed, setFeed] = useState([])
    const [selectedItem, setSelectedItem] = useState('');
    const [modalVis, setModalVis] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        // Will need a hook to onnavigate to this page to do a auto-refresh.
        /*{
            "id": 1,
            "date_created": "2020-07-22T14:14:50.130Z",
            "title": "First Test Feed",
            "details": "This is a test feed item, that will be set to High Priority. This is just a bunch of junk to test it out...",
            "high_priority": true,
            "author": "Andrew Caines",
            "archived": false,
            "active": true,
            "date_modified": null
        }
        */
        async function getFeed() {
            let result = await serverAPI.get('newsFeed');
            if (result.data.success) {
                console.log(result.data.payload)
                setFeed(result.data.payload);
                setLoading(false);
            } else {
                //TODO: Handle load error!
                setLoading(false);
            }

        }
        setLoading(true);
        getFeed();
        //Need to return a function to cancel Axios!
    }, []);

    const onRefresh = React.useCallback(() => {
        async function getFeed() {
            let result = await serverAPI.get('newsFeed');
            if (result.data.success) {
                setFeed(result.data.payload);
                setLoading(false);
            } else {
                //TODO: Handle load error!
                setLoading(false);
            }

        }
        setLoading(true);
        getFeed();
    }, [refreshing]);

    const RowDisplay = ({ date_created, title, id, high_priority }) => {

        const SubTitle = () => {
            return high_priority ? <Text style={{ fontWeight: '100', color: 'red' }}>High Priority, please review</Text> : null
        }

        return (
            <TouchableOpacity onPress={() => {
                //set the ID as selectedItem, toggle Modal visibilty
                setSelectedItem(feed.find(f => f.id === id));
                setModalVis(!modalVis); //Toggle it.
                console.log(selectedItem)
            }}>
                <ListItem
                    chevron
                    bottomDivider
                    title={`${new Date(date_created).toLocaleDateString('en-us')} - ${title}`}
                    key={id}
                    subtitle={SubTitle()}
                />
            </TouchableOpacity>
        );
    };

    const RenderedView = () => {
        if (loading) {
            return (
                <View>
                    <ActivityIndicator size="large" />
                </View>
            );
        } else {
            return (
                <View>
                    <FlatList
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        data={feed}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => <RowDisplay date_created={item.date_created} title={item.title} id={item.id} high_priority={item.high_priority} />}

                    />
                    <View style={styles.centeredView}>
                        <Modal
                            visible={modalVis}
                            transparent={true}
                            onRequestClose={() => setModalVis(false)}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style={styles.modalText}>{selectedItem.author}</Text>
                                    <Text>Message: {selectedItem.details}</Text>
                                    <Button title="ok" onPress={() => setModalVis(false)} />
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>
            );
        }
    }

    return (<RenderedView />);
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export default FeedScreen;