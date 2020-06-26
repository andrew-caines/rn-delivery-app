import React, { useState, useEffect } from 'react';
import { Button, View, Text, StyleSheet, FlatList, Modal, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';

const FeedScreen = (props) => {

    const [feed, setFeed] = useState([])
    const [selectedItem, setSelectedItem] = useState('');
    const [modalVis, setModalVis] = useState(false);

    useEffect(() => {
        //This is a fixture for now, but in future this would be where feed is populated.
        // Will need a hook to onnavigate to this page to do a auto-refresh.
        const fixture = [
            { id: '0', author: 'Andrew Caines', date: '06/18/2020', priority: 'high', title: 'Travel Warning', details: 'A fake accident has happened on a fake road, please take fake precautions' },
            { id: '1', author: 'Andrew Caines', date: '06/19/2020', priority: 'low', title: 'Holiday Notice', details: 'Its a holiday next week, so plan accordingly, things will be busy etc' },
            { id: '2', author: 'Andrew Caines', date: '06/20/2020', priority: 'high', title: 'South Edmonton Homes', details: 'A an outbreak of Ebola, so PPE is required for deliveries' },
            { id: '3', author: 'Andrew Caines', date: '06/21/2020', priority: 'low', title: 'Late Delivery', details: 'Dont bang on windows when doing late night deliveries, these are old peopole!!!!' },
            { id: '4', author: 'Andrew Caines', date: '06/22/2020', priority: 'low', title: 'And a another thing...', details: 'I know what you did last summer....' },
        ];
        setFeed(fixture);
    }, []);

    const RowDisplay = ({ date, title, id, priority }) => {

        const SubTitle = () => {
            return priority === 'high' ? <Text style={{ fontWeight: '100', color: 'red' }}>High Priority, please review</Text> : null
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
                    title={`${date} - ${title}`}
                    key={id}
                    subtitle={SubTitle()}
                />
            </TouchableOpacity>
        );
    };
    return (
        <View>
            <FlatList
                data={feed}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <RowDisplay date={item.date} title={item.title} id={item.id} priority={item.priority} />}

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