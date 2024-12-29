import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const API_URL ="https://jsonplaceholder.typicode.com/posts?"
interface Post {
  id: number,
  title: string,
  body: string,
  userId: number
}

export default function index() {
  const [postList, setPostList] = useState<Post[]>([])

  const fetchData = async (limit: number = 10) => {
    const response = await fetch(`${API_URL}_limit=${limit}`);

    const data = await response.json() as Post[];
    setPostList(data);
  }

  useEffect(() => {
    fetchData(10)
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <FlatList
          data={postList}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.bodyText}>{item.body}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={() => <Text style={styles.headerText}>
            Posts List
          </Text>}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={()=> <Text style={styles.emptyListText}>No posts found</Text>}
          ListFooterComponent={() => <Text style={styles.footerText}>End of posts</Text>}
        />
      </View>
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
  }
})