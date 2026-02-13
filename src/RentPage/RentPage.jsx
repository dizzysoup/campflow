import React, { useState, useEffect } from "react";
import { 
   Text ,Flex,Spacer,Box,  Image,
  Button, Dialog
} from "@chakra-ui/react";
import { db } from "../firebase"; 
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import "./RentalItemCard.css"
import { CreateExpenseForm } from "./CreateExpenseForm";
import { motion, useDragControls } from "framer-motion";


const RentalItemCard = ({ item }) => {
  if (!item) return null;

  return (
    <Flex className="rental-card">
      {/* 左側圖示區 */}
      <Image 
        src="/src/icons/clamp.png"               
        boxSize="90px" 
        objectFit="contain"
        borderRadius="10px" 
        bg="white" 
        p={2} />

      {/* 中間資訊區 */}
      <Box ml="10px">
          <div className="rental-content">
            <div className="rental-header">
              <h3 className="rental-title">
                {item.itemName}
              </h3>
              <span className="rental-status-badge">
                租借中
              </span>
            </div>
            
            <div className="rental-details">
              <p className="rental-price">
                NT$ {item.price}
              </p>
              <div className="rental-meta">
                <span className="rental-footer">負責人：{item.manager}</span>           
              </div>
            </div>
          </div>
      </Box>
      {/* 右側箭頭 */}
      <Spacer/>
      <div className="rental-arrow-icon"></div>
    </Flex>
  );
};

function RentPage(){
  const [rentalsList, setRentalsList] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchRentalsList = async () => {
      const querySnapshot = await getDocs(collection(db, "rentals"));
      const rentalsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,               
          itemName: data.itemName, // 帳篷
          manager: data.manager, // 負責人
          price: data.price, // 價格
          payee: data.payee, // 分擔方式
          createdAt: data.createdAt  // 如果你有存時間戳記的話
        };
      });     
      setRentalsList(rentalsData);     
    };
    fetchRentalsList();

  }, []);

  const dragControls = useDragControls();

  return (
    <Box >
      <Box textAlign="center" mt="5%">
        <Text color="#4A3728" fontWeight="bold">要特地租借的東西</Text>
      </Box>
      <Box w="60%" ml="10%" mt="2%">
        {rentalsList.map(item => (
          <RentalItemCard key={item.id} item={item} />
        ))}
      </Box>
      
      <Box 
        position="fixed" 
        bottom="40px" 
        left="50%"    
        transform="translateX(-50%)"
        zIndex={10}    
      >
        <Button 
          onClick={() => setOpen(true)}
          bg="#958de3" 
          color="black" 
          borderRadius="20px"          
          borderBottom="4px solid #5B6D5B"
          px={8}
          _hover={{ bg: '#7A8F7A' }}
        >
          新增開支
        </Button>
      </Box>
      
      <Dialog.Root 
        placement="bottom" 
        open={open} 
        onOpenChange={(e) => setOpen(e.open)}
        motionPreset="slide-in-bottom"        
      >
        <Dialog.Backdrop /> 
        
        <Dialog.Content           
          as={motion.div} 
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.5 }} // 禁止往上拉，只允許往下拉
          onDragEnd={(e, info) => {
            if (info.offset.y > 150) {
              setOpen(false);
            }
          }}
          // --- 定位關鍵屬性 ---
          position="fixed"
          bottom="-5%" 
          left="0" 
          right="0" 
          h="auto"
          maxH="70vh"
          bg="#86A686" 
          borderTopRadius="30px" 
          p={0}
          
          display="flex"
          flexDirection="column"
        >
          {/* 拖曳手把區塊 */}
          <Box 
            w="100%" 
            py={4} // 稍微加寬一點更好點擊
            display="flex" 
            justifyContent="center" 
            cursor="grab"
            _active={{ cursor: "grabbing" }}
            flexShrink={0} // 確保手把不會因為內容多而被壓縮
          >
            <Box 
              w="40px" 
              h="5px" 
              bg="whiteAlpha.800" // 顏色調亮一點比較顯眼
              borderRadius="full" 
            />
          </Box>

          {/* 內容區塊 */}
          <Dialog.Body 
            p={0}            
            overflow="auto"
            flex="1" // 讓內容區自動填滿剩餘高度
          >
            <CreateExpenseForm />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}

export default RentPage;