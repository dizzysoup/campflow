import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const location = useLocation();
  
  // 取得儲存的登入狀態
  const authStatus = localStorage.getItem("auth");

  // 判斷是否為有效登入（正式用戶 "1" 或 訪客 "guest"）
  const isAuthed = authStatus === "1" || authStatus === "guest";

  if (!isAuthed) {
    // 如果都沒有，才跳轉回登入頁
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}