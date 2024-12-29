import { API_URL } from '@/lib';
import { Fragment, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Button, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Post {
  id: number,
  title: string,
  body: string,
  userId: number
}

export default function index() {
  const [postList, setPostList] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setPostList([data, ...postList]);
      setPostTitle('');
      setPostBody('');
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Failed to add post');
    }finally{
      setIsPosting(false);
    }
  }

  const fetchData = async (limit: number = 5) => {
    try {
      const response = await fetch(`${API_URL}_limit=${limit}`);
      const data = await response.json() as Post[];
      setPostList(data);
      setIsLoading(false);
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData(20);
    setIsRefreshing(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator 
          size={"large"} 
          color={"#0000ff"} 
        />
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) 
      :
      <Fragment>
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
        <View>
          <FlatList
            data={postList}
            renderItem={({ item }) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.titleText}>{item.id}{`)`} - {item.title}</Text>
                <Text style={styles.bodyText}>{item.body}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={() => <Text style={styles.headerText}>
              Posts List
            </Text>}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => <Text style={styles.emptyListText}>No posts found</Text>}
            ListFooterComponent={() => <Text style={styles.footerText}>End of posts</Text>}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        </View>
      </Fragment>}
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: 'plum',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 16,
    color: 'gray',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
    padding: 10
  },
  separator: {
    height: 10,
  },
  emptyListText: {
    fontSize: 16,
    color: 'gray',
    padding: 10
  },
  footerText: {
    fontSize: 16,
    color: 'gray',
    padding: 10,
    textAlign: 'center'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    alignItems: 'center'
  },
  form: {
    backgroundColor: 'white',
    marginBlock: 50,
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
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC0CB',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    margin: 16,
  },
  errorText: {
    color: "#D8000C",
    fontSize: 16,
    textAlign: "center"
  }
})