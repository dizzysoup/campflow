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
        src={item.iconpath}              
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
          createdAt: data.createdAt,  // 如果你有存時間戳記的話
          iconpath : data.iconpath || "/src/icons/clamp.png" // 預設圖示路徑
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
    </Box>
  );
}

export default RentPage;