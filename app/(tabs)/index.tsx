import { API_URL } from '@/lib';
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Platform, StatusBar, SafeAreaView } from 'react-native'

export default function explore() {
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleAddPost = async () => {
    setIsPosting(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: postTitle, body: postBody }),
      });

      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <SafeAreaView style={[styles.container, styles.safeConatiner]}>
      <Text style={styles.title}>Create a new post</Text>
      <View style={styles.form}>
        <View>
          <Text style={styles.label}>Post Title:</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Enter a title"
            value={postTitle}
            onChangeText={(text) => setPostTitle(text)}
          />
        </View>
        <View>
          <Text style={styles.label}>Post Body:</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Enter a body"
            value={postBody}
            multiline
            textAlignVertical='top'
            onChangeText={(text) => setPostBody(text)}
          />
        </View>
        <Button
          title={isPosting ? 'Posting...' : 'Add Post'}
          onPress={handleAddPost}
          disabled={isPosting}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'plum',
    paddingHorizontal: 10,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  safeConatiner: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  form: {
    backgroundColor: 'white',
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
    gap: 20
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    borderRadius: 5,
  },
  multilineInput: {
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    borderRadius: 5,
    minHeight: 100,
  }
})