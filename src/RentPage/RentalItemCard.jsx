import React, { useState, useEffect } from "react";
import { 
   Flex,Spacer,Box,  Image,
} from "@chakra-ui/react";

import "./RentalItemCard.css"


// 增加 onEdit 參數
export const RentalItemCard = ({ item, onEdit }) => {
  if (!item) return null;

  return (
    // 增加 onClick 事件
    <Flex className="rental-card" cursor="pointer" onClick={() => onEdit(item)}>
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
      <Spacer/>
      <div className="rental-arrow-icon"></div>
    </Flex>
  );
};

