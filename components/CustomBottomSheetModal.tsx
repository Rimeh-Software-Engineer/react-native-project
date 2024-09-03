import React, {
  forwardRef,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import Colors from "@/constants/Colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "@/services/config";

interface Comment {
  id: string;
  name: string;
  comment: string;
  pictureUrl: string;
}

interface CustomBottomSheetModalProps {
  listing: any; // Adjust typing as needed
  comments?: Comment[]; // Make comments optional
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const CustomBottomSheetModal = forwardRef<
  BottomSheetModal,
  CustomBottomSheetModalProps
>(({ listing, comments = [], setComments }, ref) => {
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState(""); // To store the logged-in user's name
  const snapPoints = useMemo(() => ["50%", "75%"], []);

  useEffect(() => {
    const fetchUserIdAndData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          const response = await axios.get(`${BASE_URL}/api/users/${userId}`);
          setUserName(response.data.name); // Set the user's name
        } else {
          console.error("User ID is not available");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserIdAndData();
  }, []);

  const getInitials = (name: string) => {
    const names = name.split(" ");
    const initials = names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    return initials;
  };

  const handlePostComment = async () => {
    if (newComment.trim() === "") {
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/comments/`,
        {
          listingId: listing.id,
          comment: newComment,
          name: userName,
          pictureUrl: "https://example.com/default.jpg",
        } // Replace with actual pictureUrl if available
      );

      // Update comments list
      setComments((prevComments) => [...prevComments, response.data]);

      // Clear input field
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: Comment }) => (
      <View style={styles.commentContainer}>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>{getInitials(item.name)}</Text>
        </View>
        <View style={styles.commentTextContainer}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userComment}>{item.comment}</Text>
        </View>
      </View>
    ),
    []
  );

  return (
    <BottomSheetModal ref={ref} index={0} snapPoints={snapPoints}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Comments</Text>
        {comments.length === 0 ? (
          <Text>No comments available.</Text>
        ) : (
          <FlatList
            data={comments}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.commentsList}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity style={styles.postButton} onPress={handlePostComment}>
          <Text style={styles.postButtonText}>Post Comment</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentTextContainer: {
    flex: 1,
  },
  userName: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  userComment: {
    fontSize: 14,
  },
  commentsList: {
    paddingBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  postButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    alignItems: "center",
    borderRadius: 10,
  },
  postButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userAvatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CustomBottomSheetModal;
