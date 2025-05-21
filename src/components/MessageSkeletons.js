import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const MessageSkeleton = () => {
    return (
      <View style={{ marginTop: 20 }}>
        <SkeletonPlaceholder borderRadius={4}>
          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
            <SkeletonPlaceholder.Item width={32} height={32} borderRadius={16} />
            <SkeletonPlaceholder.Item marginLeft={20}>
              <SkeletonPlaceholder.Item width={80} height={10} />
              <SkeletonPlaceholder.Item marginTop={6} width={120} height={10} />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </View>
    );
  };
  export default MessageSkeleton;
