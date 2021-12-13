import React,{useEffect, useState} from 'react'
import {     StatusBar,
  FlatList,
  Image,
  Animated,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Easing,
  SafeAreaViewBase,
  SafeAreaView,
  Pressable,} from 'react-native'
  const { width, height } = Dimensions.get('screen');
const IMAGE_SIZE=80;
const SPACING=10;
const API_KEY = '563492ad6f91700001000001b2bc52139509447396890f92c7894c24';
const API_URL =
  'https://api.pexels.com/v1/search?query=nature&orientation=portrait&size=small&per_page=20';
export default function App() {
  const [images, setImages] = useState(null)
  const fetchImagesFromPexels = async () => {
    const data = await fetch(API_URL, {
      headers: {
        Authorization: API_KEY,
      },
    });
    const {photos} = await data.json();
    return photos;
  }
useEffect(() => {
    const fetchImages = async () => {
      const imagess = await fetchImagesFromPexels();
      setImages(imagess);
    };
    fetchImages();
  }, []);
  const topRef=React.useRef();
  const thumbRef=React.useRef();
  const [activeIndex,setActiveIndex]=useState(0);
  const scrollToActiveIndex=(index)=>{
    setActiveIndex(index)
    topRef?.current?.scrollToOffset({
      offset:index*width,
      animated:true
    })
    //0 * 90 -40 >200
    if(index*(IMAGE_SIZE+SPACING)-IMAGE_SIZE/2>width/2){
      thumbRef?.current?.scrollToOffset({
        //3 (90)-200 + 40
        offset:index*(IMAGE_SIZE+SPACING)-width/2+IMAGE_SIZE/2,
        animated:true
      })
    }
    else{
      thumbRef?.current?.scrollToOffset({
        offset:0,
        animated:true
      })
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
      ref={topRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onMomentumScrollEnd={(ev)=>{
          scrollToActiveIndex(Math.floor(ev.nativeEvent.contentOffset.x/width))
        }}
        renderItem={({item}) => {
         
          return(
            <View style={{width, height}}>
          <Image
            source={{uri: item.src.portrait}}
            style={[StyleSheet.absoluteFillObject]}
          />
          </View>
          )
        }}
      />
       <FlatList
       ref={thumbRef}
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingHorizontal:SPACING}}
        style={{position:'absolute',bottom:IMAGE_SIZE}}
        renderItem={({item,index}) => {
         
          return(
            <Pressable onPress={()=>{
              scrollToActiveIndex(index)
            }}>
          <Image
            source={{uri: item.src.portrait}}
              style={{
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                borderRadius: 12,
                marginRight: SPACING,
              borderWidth:2,
            borderColor:activeIndex==index?'#fff':'transparent'}}
          />
        </Pressable>
          )
        }}
      />
    </View>

  )
}

const styles = StyleSheet.create({})
