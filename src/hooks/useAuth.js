import { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // 改用 getDoc 直接讀取
import { useToast } from '../context/ToastContext';


const toEmail = (username) => {
 if (username.includes('@')) return username;
 return `${username}@teamaura.app`;
};


export const useAuth = () => {
 const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('pogo_current_user') || 'null'));
 const [loading, setLoading] = useState(true);
 const { showToast } = useToast();


 useEffect(() => {
   const unsubscribe = onAuthStateChanged(auth, async (user) => {
     if (user) {
       try {
           // 修改重點：直接使用 user.uid 來讀取 users 集合中的對應文件
           // 這要求 Firestore 中的 users 文件 ID 必須與 Auth UID 一致
           const userDocRef = doc(db, "users", user.uid);
           const userDocSnap = await getDoc(userDocRef);


           if (userDocSnap.exists()) {
             const userData = userDocSnap.data();
             const fullUser = {
               ...userData,
               uid: user.uid, // 使用 Auth 的 UID
               // email: user.email, // 不再從 Firestore 讀取 email，直接用 Auth 的
               // 如果 Firestore 裡沒有 email 欄位了，這裡也不會洩漏
               firestoreId: user.uid,
               isAdmin: !!userData.isAdmin
             };
             setCurrentUser(fullUser);
             localStorage.setItem('pogo_current_user', JSON.stringify(fullUser));
           } else {
              console.warn("User data not found in Firestore (UID match failed).");
              // 如果找不到，可能是舊帳號結構 (Doc ID != UID)
              // 這裡可以做一個 fallback 或者是提示管理員遷移資料
              showToast("找不到使用者資料，請聯繫管理員確認帳號設定", "error");
              // 暫時登出以策安全，或是給予一個只有基本權限的 user 物件
              await signOut(auth);
              setCurrentUser(null);
           }
       } catch (error) {
           console.error("Auth Error:", error);
           showToast("登入發生錯誤", "error");
           await signOut(auth);
           setCurrentUser(null);
       }
     } else {
       setCurrentUser(null);
       localStorage.removeItem('pogo_current_user');
     }
     setLoading(false);
   });
   return () => unsubscribe();
 }, [showToast]);


 const login = async (username, password) => {
   if (!username || !password) return showToast("請輸入帳號密碼", "error");
   setLoading(true);
   try {
     await signInWithEmailAndPassword(auth, toEmail(username), password);
     showToast("登入成功");
   } catch (e) {
     console.error(e);
     let msg = "登入失敗";
     if (e.code === 'auth/invalid-credential') msg = "帳號或密碼錯誤";
     if (e.code === 'auth/user-not-found') msg = "找不到此使用者";
     if (e.code === 'auth/too-many-requests') msg = "嘗試次數過多，請稍後再試";
     showToast(msg, "error");
   } finally {
     setLoading(false);
   }
 };


 const logout = async () => {
   try {
       await signOut(auth);
       showToast("已登出");
   } catch (e) {
       console.error(e);
   }
   setCurrentUser(null);
   localStorage.removeItem('pogo_current_user');
 };


 const updateCurrentUser = (newData) => {
   setCurrentUser(prev => {
       if (!prev) return null;
       const updated = { ...prev, ...newData };
       localStorage.setItem('pogo_current_user', JSON.stringify(updated));
       return updated;
   });
 };


 return { currentUser, loading, login, logout, updateCurrentUser };
};

