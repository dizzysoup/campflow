import React, { useState, useEffect } from "react";
import { 
   Text ,Flex,Spacer,Box,  Image,
  Button, Dialog
} from "@chakra-ui/react";
import { db } from "../firebase"; 
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import "./RentalItemCard.css"
import { motion, useDragControls } from "framer-motion";
import { CreateForm } from "../components/element/CreateForm";
import { createListCollection } from "@chakra-ui/react"; 
import { EditBox } from "../components/element/EditBox";
import { RentalItemCard } from "./RentalItemCard";

function RentPage(){
  const [rentalsList, setRentalsList] = useState([]);
  const [open, setOpen] = useState(false);
  const dbName = "rentals"; 
  const [editingItem, setEditingItem] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [users, setUsers] = useState([]);
  const userCollection = createListCollection({
        items: users,
  });


  useEffect(() => {
    const fetchRentalsList = async () => {
      const querySnapshot = await getDocs(collection(db, dbName));
      const rentalsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,               
          itemName: data.itemName,
          manager: data.manager,
          iconpath : data.iconpath,
          category: data.category,        
          num: data.num ,
          note : data.note,
          assignees: data.assignees || [],
          payers: data.payers || [], // 加入 payers 資料
          price: data.price || 0, // 單價
          totalPrice: data.totalPrice || 0 // 總價
        };
      });
      setRentalsList(rentalsData);     
    };
    fetchRentalsList();
  }, [open, editingItem, refreshFlag]); // 當 open 或 editingItem 變化時重新取得資料

  const dragControls = useDragControls();

  return (
    <Box >
      <Box textAlign="center" mt="5%">
        <Text color="#4A3728" fontWeight="bold">要特地租借的東西</Text>
      </Box>
      <Box w="60%" ml="10%" mt="2%">
        {rentalsList.map(item => (
          <RentalItemCard 
            key={item.id} 
            item={item} 
            onEdit={(selectedItem) => setEditingItem(selectedItem)} 
          />
        ))}
      </Box>    


        {/* 新增按鈕與 Dialog 保持不變 ... */}
      <Box position="fixed" bottom="40px" left="50%" transform="translateX(-50%)" zIndex={10}>
        <Button onClick={() => setOpen(true)} bg="#958de3" color="black" borderRadius="20px" borderBottom="4px solid #5B6D5B" px={8}>
          新增租借物品
        </Button>
      </Box> 
      
      <Dialog.Root
        placement="bottom"
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        motionPreset="slide-in-bottom"
        closeOnInteractOutside={false}
      >
        <Dialog.Backdrop />
        <Dialog.Content          
          as={motion.div}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.5 }}
                    onDragEnd={(e, info) => {
                      if (info.offset.y > 150) {
                        setOpen(false);
                      }
                    }}
                   position="fixed"
                    bottom="-5%"
                    left="0"
                    right="0"
                    h="auto"
                    maxH="50vh"
                    bg="#86A686"
                    borderTopRadius="30px"
                    p={0}              
                    display="flex"
                    flexDirection="column"
                  >
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
                      overflowY="auto"  
                      flex="1" // 讓內容區自動填滿剩餘高度
                    >
                      <CreateForm onClose={() => setOpen(false)} userCollection={userCollection} dbName={dbName} />
                    </Dialog.Body>
                  </Dialog.Content>
      </Dialog.Root>  

      {/* 編輯視窗 */}
      {editingItem && (
        <EditBox 
          item={editingItem} 
          onClose={() => setEditingItem(null)} 
          userCollection={userCollection}           
          onSave={ async (newData) => {
            try {
              const authStatus = localStorage.getItem("auth");
              if (authStatus === "guest") {
                  // 如果有 toaster 則使用，否則可用 alert
                  console.error("權限不足");
                  return;
              }
              
              // 取得該文件在 Firestore 的引用
              const gearRef = doc(db, dbName, newData.id); 
              
              // 更新 Firestore 資料庫
              await updateDoc(gearRef, {
                num: Number(newData.num),
                manager: newData.manager,                  
                note: newData.note, 
                assignees: newData.assignees || [],
                payers: newData.payers || []
              });

              // 關閉編輯視窗並觸發刷新 (透過 refreshFlag 或重新 fetch)
              setEditingItem(null);
              setRefreshFlag(!refreshFlag); 
            } catch (error) {
              console.error("更新失敗：", error);
            }
          }}
        />
      )}
    </Box>
  );
}

export default RentPage;