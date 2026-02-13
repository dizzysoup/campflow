import { useState, useEffect } from "react";
import { Box, Text, Button, Dialog, Flex , Spacer , Image } from "@chakra-ui/react";
import { db } from "../firebase"; 
import { collection, getDocs } from "firebase/firestore";
import { CreateGearForm } from "./CreateGearForm";
import { motion } from "framer-motion";


const GearlItemCard = ({ item }) => {
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
              <div className="rental-meta">
                <span className="rental-footer">負責人：{item.manager}</span>           
              </div>
            </div>
          </div>
      </Box>
      <Spacer/>
      <Text color="black"> x {item.num}</Text>
    </Flex>
  );
};

function GearPage(){
  const [rentalsList, setRentalsList] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchRentalsList = async () => {
      const querySnapshot = await getDocs(collection(db, "gear"));
      const rentalsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,               
          itemName: data.itemName, // 帳篷
          manager: data.manager, // 負責人
          iconpath : data.iconpath, // 圖片路徑          
          num: data.num 
        };
      });
      console.log(rentalsData);
      setRentalsList(rentalsData);     
    };
    fetchRentalsList();

  }, [open]);

  return (
    <Box >
      <Box textAlign="center" mt="5%">
        <Text color="#4A3728" fontWeight="bold">要攜帶的東西</Text>
      </Box> 

      <Box 
        ml="10%" 
        mt="2%" 
        pb="100px"        
        css={{
          '&::-webkit-scrollbar': { display: 'none' },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        }}
      >
              {rentalsList.map(item => (
                <GearlItemCard key={item.id} item={item} />
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
          新增用具
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
                
                flex="1" // 讓內容區自動填滿剩餘高度
              >
                <CreateGearForm onClose={() => setOpen(false)} />
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Root>
    </Box>
  );
}

export default GearPage;