// 右クリック時のデフォルトの動作を無効化
document.body.addEventListener("contextmenu", function (event) {
  event.preventDefault();
});

//-------------------------------
//firebaseの初期化-
//-------------------------------

const firebaseConfig = {
  apiKey: "AIzaSyAQOmAz0HPwHuddugm5dQxgeVwrkGdXTxA",
  authDomain: "whiteboard-f80a0.firebaseapp.com",
  projectId: "whiteboard-f80a0",
  storageBucket: "whiteboard-f80a0.appspot.com",
  messagingSenderId: "402852310505",
  appId: "1:402852310505:web:40b1ffc720ce72dc07ef78",
  measurementId: "G-E5RZ7H6S7G",
};

import { initializeApp } from "firebase/app";
import {} from "firebase/compat/firestore";
import {} from "firebase/compat/auth";
import {
  getDoc,
  getDocs,
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  getCountFromServer,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";

//-------------------------------
//firebaseのデータを変数に
//-------------------------------

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const messageText = document.querySelector(".chatarea").value;

//-------------------------------
// チャットエリアやヘッダーのアイコンの表示
//-------------------------------

onAuthStateChanged(auth, async (user) => {
  const displayName = user.displayName;
  const icon = user.photoURL;
  const imgagephoto = document.querySelector("#image");
  const profileuser = document.querySelector("#username");

  profileuser.textContent = displayName;
  imgagephoto.src = icon;

  //-------------------------------
  // firebaseの取得
  //-------------------------------

  const citiesRef = collection(db, "user");
  const q = query(citiesRef, orderBy("timestamp", "asc"));
  const querySnapshot = await getDocs(q);

  //-------------------------------
  // 読み込み時、チャットエリアの表示
  //-------------------------------

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    //-------------------------------
    // チャットエリアのひとつひとつの要素
    //-------------------------------

    const divelement = document.createElement("div");
    divelement.classList.add("userinfo");

    //-------------------------------
    // ユーザーのアイコンと、名前と内容をflexするdiv生成
    //-------------------------------

    const userUI = document.createElement("div");
    userUI.classList.add("iconflex");

    //-------------------------------
    // ユーザの名前と内容をflexするためにdiv生成
    //-------------------------------

    const UsertextUI = document.createElement("div");
    UsertextUI.classList.add("usertextui");

    //-------------------------------
    // ユーザーアイコン表示
    //-------------------------------

    const iconElement = document.createElement("img");
    iconElement.src = data.icon;
    iconElement.alt = "User Icon";
    userUI.appendChild(iconElement);
    iconElement.classList.add("usericon");

    //-------------------------------
    // ユーザーネーム表示
    //-------------------------------

    const nameElement = document.createElement("p");
    nameElement.textContent = data.name;
    UsertextUI.appendChild(nameElement);

    iconElement.classList.add("username");

    //-------------------------------
    // ユーザーの入力した内容の表示
    //-------------------------------

    const textelement = document.createElement("p");
    textelement.textContent = data.messageText;
    UsertextUI.appendChild(textelement);
    iconElement.classList.add("usertext");

    //-------------------------------
    // appendChildする
    //-------------------------------

    userUI.appendChild(UsertextUI);
    divelement.appendChild(userUI);
    document.querySelector("#output").appendChild(divelement);
  });

  //-------------------------------
  // Enterを押して送信
  //-------------------------------
  $("#text").on("keydown", async function (e) {
    if (e.key === "Enter") {
      const messageText = $("#text").val();
      const textarea = document.querySelector("#text");
      setTimeout(() => {
        textarea.value = "";
      }, 5);

      //-------------------------------
      // 送信したら内容を保存する
      //-------------------------------
      if (messageText !== "") {
        const userRef = await addDoc(collection(db, "user"), {
          name: displayName,
          icon: icon,
          messageText: messageText,
          timestamp: new Date(),
        });

        //-------------------------------
        // チャットエリアのひとつひとつの要素
        //-------------------------------

        const divelement = document.createElement("div");
        divelement.classList.add("userinfo");

        //-------------------------------
        // ユーザーのアイコンと、名前と内容をflexするdiv生成
        //-------------------------------

        const userUI = document.createElement("div");
        userUI.classList.add("iconflex");

        //-------------------------------
        // ユーザの名前と内容をflexするためにdiv生成
        //-------------------------------

        const UsertextUI = document.createElement("div");
        UsertextUI.classList.add("usertextui");

        //-------------------------------
        // ユーザーアイコン表示
        //-------------------------------

        const iconElement = document.createElement("img");
        iconElement.src = icon;
        iconElement.alt = "User Icon";
        userUI.appendChild(iconElement);
        iconElement.classList.add("usericon");

        //-------------------------------
        // ユーザーネーム表示
        //-------------------------------

        const nameElement = document.createElement("p");
        nameElement.textContent = displayName;
        UsertextUI.appendChild(nameElement);

        iconElement.classList.add("username");

        //-------------------------------
        // ユーザーの入力した内容の表示
        //-------------------------------

        const textelement = document.createElement("p");
        textelement.textContent = messageText;
        UsertextUI.appendChild(textelement);
        iconElement.classList.add("usertext");

        //-------------------------------
        // appendChildする
        //-------------------------------

        userUI.appendChild(UsertextUI);
        divelement.appendChild(userUI);
        document.querySelector("#output").appendChild(divelement);
      }
    }
  });
});

// --------------------------------ボタン系------------------------------------------
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
// 付箋
var whiteButton = document.querySelector("#addTextareaButton");
whiteButton.addEventListener("click", () => {
  addCard("white");
});

var blackButton = document.querySelector("#black_btn");
blackButton.addEventListener("click", () => {
  addCard("black");
});

var pinkButton = document.querySelector("#pink_btn");
pinkButton.addEventListener("click", () => {
  addCard("pink");
});

var blueButton = document.querySelector("#blue_btn");
blueButton.addEventListener("click", () => {
  addCard("blue");
});

var greenButton = document.querySelector("#green_btn");
greenButton.addEventListener("click", () => {
  addCard("green");
});

// --------------------------------------------------------------------------------

// ---------------------------------------------ボタン系functionはここから-----------------------------------

let t;

async function initializeT() {
  const load = collection(db, "textareaInfo");
  const snapshot = await getCountFromServer(load);
  t = snapshot.data().count;
}

function addCard(color) {
  //------------------------------------
  // 変数の作成
  //------------------------------------

  const newTextarea = document.createElement("textarea");

  const textareaContainer = document.querySelector("#textareaContainer");
  textareaContainer.appendChild(newTextarea);

  //------------------------------------
  //クラスの追加
  // -----------------------------------

  newTextarea.classList.add(`color__${color}`, "resize-drag");
  newTextarea.setAttribute("data-name", `husen${++t}`);

  //------------------------------------
  // firebaseに保存する
  //  --------------------------------

  const name = newTextarea.getAttribute("data-name");

  //------------------------------------
  // inputで保存
  //  --------------------------------

  newTextarea.addEventListener("input", function () {
    const dataX = newTextarea.getAttribute("data-x");
    const dataY = newTextarea.getAttribute("data-y");
    const Classname = newTextarea.getAttribute("class");
    const width = newTextarea.style.width;
    const height = newTextarea.style.height;
    const style = window.getComputedStyle(newTextarea);
    const transform = style.getPropertyValue("transform");
    const values = transform.split("(")[1].split(")")[0].split(",");
    const translateX = values[4];
    const translateY = values[5];
    const Dataname = newTextarea.getAttribute("data-name");

    setDoc(doc(db, "textareaInfo", name), {
      text: newTextarea.value,
      Colorname: Classname,
      X: translateX,
      Y: translateY,
      datax: dataX,
      datay: dataY,
      width: width,
      height: height,
      dataname: Dataname,
      show: true,
    });
  });

  //------------------------------------
  // mouseupで保存
  //  --------------------------------

  newTextarea.addEventListener("mouseup", function () {
    const Classname = newTextarea.getAttribute("class");
    const dataX = newTextarea.getAttribute("data-x");
    const dataY = newTextarea.getAttribute("data-y");
    const width = newTextarea.style.width;
    const height = newTextarea.style.height;
    const style = window.getComputedStyle(newTextarea);
    const transform = style.getPropertyValue("transform");
    const values = transform.split("(")[1].split(")")[0].split(",");
    const translateX = values[4];
    const translateY = values[5];
    const Dataname = newTextarea.getAttribute("data-name");

    setDoc(doc(db, "textareaInfo", name), {
      text: newTextarea.value,
      X: translateX,
      Y: translateY,
      Colorname: Classname,
      datax: dataX,
      datay: dataY,
      width: width,
      height: height,
      dataname: Dataname,
      show: true,
    });
  });

  //----------------------------------
  // mousedownで保存
  //  --------------------------------

  newTextarea.addEventListener("mousedown", function () {
    const Classname = newTextarea.getAttribute("class");
    const dataX = newTextarea.getAttribute("data-x");
    const dataY = newTextarea.getAttribute("data-y");
    const width = newTextarea.style.width;
    const height = newTextarea.style.height;
    const style = window.getComputedStyle(newTextarea);
    const transform = style.getPropertyValue("transform");
    const values = transform.split("(")[1].split(")")[0].split(",");
    const translateX = values[4];
    const translateY = values[5];
    const Dataname = newTextarea.getAttribute("data-name");

    setDoc(doc(db, "textareaInfo", name), {
      text: newTextarea.value,
      X: translateX,
      Y: translateY,
      Colorname: Classname,
      datax: dataX,
      datay: dataY,
      width: width,
      height: height,
      dataname: Dataname,
      show: true,
    });
  });

  //------------------------------------
  // ここまでfirebase
  //------------------------------------

  //------------------------------------
  // クリックイベントの追加

  // ダブルクリック
  //------------------------------------
  let nowTarget;
  newTextarea.addEventListener("dblclick", function (event) {
    select(event.target);
    nowTarget = event.target.dataset.name;
  });

  //------------------------------------
  // 右クリック
  //------------------------------------

  newTextarea.addEventListener("contextmenu", function (event) {
    select(event.target);
    nowTarget = event.target.dataset.name;
  });

  //------------------------------------
  // バックスペースで削除
  //------------------------------------

  newTextarea.addEventListener("keydown", function (event) {
    if (event.key === "Backspace") {
      remove(nowTarget);
    }
  });
}

//------------------------------------
// 選択時の削除の動き
//------------------------------------

function select(element) {
  if (element.classList.contains("remove")) {
    element.classList.remove("remove");
  } else {
    const selectElement = document.querySelectorAll(".remove");
    selectElement.forEach((selectedElement) => {
      selectedElement.classList.remove("remove");
    });

    element.classList.add("remove");
  }
}

/* test */

const querySnapshot = await getDocs(collection(db, "textareaInfo"));
querySnapshot.forEach((text, index, array) => {
  if (text.data().show) {
    //------------------------------------
    // 変数の作成
    //------------------------------------

    const newTextarea = document.createElement("textarea");
    const textareaContainer = document.querySelector("#textareaContainer");
    textareaContainer.appendChild(newTextarea);

    //------------------------------------
    // クラスの追加
    //------------------------------------

    newTextarea.setAttribute("data-name", text.data().dataname);
    newTextarea.value = text.data().text;
    newTextarea.setAttribute("data-x", text.data().datax);
    newTextarea.setAttribute("data-y", text.data().datay);
    newTextarea.setAttribute("class", text.data().Colorname);
    newTextarea.style.width = text.data().width;
    newTextarea.style.height = text.data().height;
    newTextarea.style.transform =
      "translate(" + text.data().X + "px, " + text.data().Y + "px)";

    //------------------------------------
    // inputで保存
    //  --------------------------------

    newTextarea.addEventListener("input", function () {
      const Classname = newTextarea.getAttribute("class");
      const dataX = newTextarea.getAttribute("data-x");
      const dataY = newTextarea.getAttribute("data-y");
      const width = newTextarea.style.width;
      const height = newTextarea.style.height;
      const style = window.getComputedStyle(newTextarea);
      const transform = style.getPropertyValue("transform");
      const values = transform.split("(")[1].split(")")[0].split(",");
      const translateX = values[4];
      const translateY = values[5];
      const Dataname = newTextarea.getAttribute("data-name");

      setDoc(doc(db, "textareaInfo", Dataname), {
        text: newTextarea.value,
        X: translateX,
        Y: translateY,
        Colorname: Classname,
        datax: dataX,
        datay: dataY,
        width: width,
        height: height,
        dataname: Dataname,
        show: true,
      });
    });

    //------------------------------------
    // mouseupで保存
    //  --------------------------------

    newTextarea.addEventListener("mouseup", function () {
      const Classname = newTextarea.getAttribute("class");
      const dataX = newTextarea.getAttribute("data-x");
      const dataY = newTextarea.getAttribute("data-y");
      const width = newTextarea.style.width;
      const height = newTextarea.style.height;
      const style = window.getComputedStyle(newTextarea);
      const transform = style.getPropertyValue("transform");
      const values = transform.split("(")[1].split(")")[0].split(",");
      const translateX = values[4];
      const translateY = values[5];
      const Dataname = newTextarea.getAttribute("data-name");

      setDoc(doc(db, "textareaInfo", Dataname), {
        text: newTextarea.value,
        X: translateX,
        Y: translateY,
        Colorname: Classname,
        datax: dataX,
        datay: dataY,
        width: width,
        height: height,
        dataname: Dataname,
        show: true,
      });
    });

    //----------------------------------
    // mousedownで保存
    //  --------------------------------

    newTextarea.addEventListener("mousedown", function () {
      const dataX = newTextarea.getAttribute("data-x");
      const dataY = newTextarea.getAttribute("data-y");
      const width = newTextarea.style.width;
      const height = newTextarea.style.height;
      const Classname = newTextarea.getAttribute("class");
      const Dataname = newTextarea.getAttribute("data-name");
      const style = window.getComputedStyle(newTextarea);
      const transform = style.getPropertyValue("transform");
      const values = transform.split("(")[1].split(")")[0].split(",");
      const translateX = values[4];
      const translateY = values[5];

      setDoc(doc(db, "textareaInfo", Dataname), {
        text: newTextarea.value,
        X: translateX,
        Y: translateY,
        Colorname: Classname,
        datax: dataX,
        datay: dataY,
        width: width,
        height: height,
        dataname: Dataname,
        show: true,
      });
    });

    //------------------------------------
    // クリックイベントの追加
    // ダブルクリック
    //------------------------------------

    let nowTarget;
    newTextarea.addEventListener("dblclick", function (event) {
      select(event.target);
      nowTarget = event.target.dataset.name;
    });

    //------------------------------------
    // 右クリック
    //------------------------------------

    newTextarea.addEventListener("contextmenu", function (event) {
      select(event.target);
      nowTarget = event.target.dataset.name;
    });

    //------------------------------------
    // バックスペースで削除
    //------------------------------------

    newTextarea.addEventListener("keydown", async function (event) {
      if (event.key === "Backspace") {
        remove(nowTarget);
      }
    });
  }
});

// ------------------------------------
// 削除する関数
// ------------------------------------

document.addEventListener("click", function (event) {
  const selectElement = document.querySelectorAll(".remove");

  selectElement.forEach((element) => {
    element.classList.remove("remove");
  });
});

async function remove(id) {
  setDoc(doc(db, "textareaInfo", id), {
    show: false,
  });

  const selectedElement = document.querySelector(".remove");
  if (selectedElement) {
    selectedElement.remove();
  }
}

//------------------------------------
// チャットエリアの画面表示
//------------------------------------

const chatImg = document.querySelector(".chat");
const chatUI = document.querySelector(".nav_content");
const empty = document.querySelector(".content__reset");

chatImg.addEventListener("click", function () {
  chatUI.style.left = "20%";
  empty.style.left = "0%";
});
const markX = document.querySelector(".markx");

markX.addEventListener("click", function () {
  chatUI.style.left = "100%";
});

empty.addEventListener("click", function () {
  chatUI.style.left = "100%";
  empty.style.left = "-20%";
});

//------------------------------------
//ログアウト
//------------------------------------

$("#logout").on("click", function () {
  location.href = "index.html";
  this.auth.signOut();
});
