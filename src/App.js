import React, { useState, useEffect } from "react";
import "./App.css";
import jsonData from "./birth_color.json";
import RenderSvg from "./RenderSvg";
import { GridLoader } from "react-spinners";

function App() {
  const [page, setPage] = useState(0); // 0: 시작 페이지, 1: 입력 페이지, 2: 결과 페이지
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (page === 1) {
      const timeoutId = setTimeout(() => {
        document.querySelector(".inputPageLayout").classList.add("fade-in");
      }, 500);

      return () => clearTimeout(timeoutId);
    }
    if (page === 2) {
      console.log("page 2");
      let count = 0;
      const color = getRandomColor();
      setLoadingColor(color);
      const intervalId = setInterval(() => {
        const color = getRandomColor();
        setLoadingColor(color);
        count++;
        if (count > 3) {
          clearInterval(intervalId);
          setPage(3);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [page]);

  const isValidDate = (month, day) => {
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);

    if (isNaN(monthNum) || isNaN(dayNum)) return false;
    if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31)
      return false;

    const daysInMonth = [
      31,
      2024 % 4 === 0 && (2024 % 100 !== 0 || 2024 % 400 === 0) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
    return dayNum <= daysInMonth[monthNum - 1];
  };

  const handleSubmit = () => {
    if (!birthMonth || !birthDay) {
      setError("날짜를 입력해 주세요.");
      return;
    }

    if (!isValidDate(birthMonth, birthDay)) {
      setError("유효하지 않은 날짜입니다.");
      return;
    }

    const month = birthMonth.trim() + "월";
    const day = birthDay.trim() + "일";

    const data = jsonData.find(
      (item) => item.month === month && item.day === day
    );

    setResult(
      data || {
        month: "정보 없음",
        day: "",
        birth_color: "#FFFFFF",
        name: "정보 없음",
        keyword1: "정보 없음",
        keyword2: "정보 없음",
        keyword3: "정보 없음",
        sentence: "정보가 없습니다.",
      }
    );

    setPage(2); // 결과 페이지로 이동
    setError("");
  };

  const handleBack = () => {
    setBirthMonth("");
    setBirthDay("");
    setPage(0); // 시작 페이지로 이동
    setError("");
  };

  const handleNextPage = () => {
    setPage((prevPage) => (prevPage < 4 ? prevPage + 1 : 2));
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => (prevPage > 2 ? 2 : prevPage - 1));
  };

  const handleReStart = () => {
    try {
      setPage(0);
    } catch (error) {
      console.warn("handleReStart error - ", error);
    }
  };

  const getBackgroundClass = () => {
    switch (page) {
      case 0:
        return "page-0";
      case 1:
        return "page-1";
      case 2:
        return "page-2";
      case 3:
        return "page-2";
      case 4:
        return "page-2";
      default:
        return "page-0";
    }
  };

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  const getBrightness = (r, g, b) => r * 0.299 + g * 0.587 + b * 0.114;

  const getContrastingColor = (hexColor) => {
    const [r, g, b] = hexToRgb(hexColor);
    const brightness = getBrightness(r, g, b);

    if (brightness > 128) {
      // 노란색 계통 (R와 G가 높고 B가 낮은 경우)
      if (r > 200 && g > 200 && b < 100) {
        return "#107A71"; // 초록색
      }
      // 빨간색 계통 (R가 높고 G와 B가 낮은 경우)
      if (r > 200 && g < 100 && b < 100) {
        return "#F0EAC7"; // 노란색
      }
      // 초록색 계통 (G가 높고 R와 B가 낮은 경우)
      if (g > 200 && r < 100 && b < 100) {
        return "#F0EAC7"; // 노란색
      }
      return "#107A71"; // 기본 초록색
    } else {
      return "#fff"; // 기본 흰색
    }
  };

  const getTitleColor = (hexColor) => {
    const [r, g, b] = hexToRgb(hexColor);
    const brightness = getBrightness(r, g, b);
    return brightness > 128 ? "#fff" : "#000";
  };

  const [loadingColor, setLoadingColor] = useState("#000000");

  const getRandomColor = () => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
  };

  return (
    <div className={`birthColor ${getBackgroundClass()}`}>
      {/* <Progress page={page} /> */}
      {page === 0 ? (
        <div className="startPageLayout">
          <div className="colorTitle">나의 탄생컬러 찾기</div>
          <div onClick={() => setPage(1)} className="startButton">
            Start
          </div>
        </div>
      ) : page === 1 ? (
        <div className="inputPageLayout">
          <h1>생일을 입력하세요</h1>
          <div className="inputFields">
            <div className="inputContainer">
              <input
                type="number"
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                min="1"
                max="12"
              />
              <span className="inputLabel">월</span>
            </div>
            <div className="inputContainer">
              <input
                type="number"
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                min="1"
                max="31"
              />
              <span className="inputLabel">일</span>
            </div>
          </div>
          <button className="buttonStyle" onClick={handleSubmit}>
            결과
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <div
          className="resultPageLayout2"
          style={
            {
              // backgroundColor: getContrastingColor(result.birth_color),
            }
          }
        >
          {page === 2 && result && (
            <div>
              <GridLoader
                color={loadingColor}
                loading={true}
                // cssOverride={override}
                size={25}
                speedMultiplier={0.8}
                margin={5}
              />
              <div
                style={{
                  padding: "20px",
                  color: loadingColor,
                  fontWeight: "700",
                }}
              >
                <h> 탄생컬러를 찾고 있어요 </h>
              </div>
            </div>
          )}
          {page === 3 && result && (
            <div className="resultPageLayout">
              <div
                className="colorContentsBox"
                style={{
                  backgroundColor: getContrastingColor(result.birth_color),
                }}
              >
                <div
                  className="flex-row flexCenter"
                  style={{ marginTop: "5vh", marginBottom: "12px" }}
                >
                  <img src="palette.png" className="titleImg"></img>
                  <div
                    className="colorTitle"
                    style={{ color: getTitleColor(result.birth_color) }}
                  >
                    나의 탄생 컬러는??
                  </div>
                  <img src="palette.png" className="titleImg"></img>
                </div>
                <p className="colorName" style={{ color: result.birth_color }}>
                  {result.name}
                </p>
                <RenderSvg
                  name="paint"
                  // width={}
                  // height={200}
                  color={result.birth_color}
                />
                <p
                  className="rgbCodeText"
                  style={{ color: result.birth_color }}
                >
                  {result.birth_color}
                </p>
                <div
                  className="contentsTextBox"
                  style={{
                    border: `2px solid ${getTitleColor(result.birth_color)}`,
                    color: getTitleColor(result.birth_color),
                  }}
                >
                  <div className="flexCenter" style={{ gap: "8px" }}>
                    <div> #{result.keyword1}</div>
                    <div> #{result.keyword2}</div>
                    <div> #{result.keyword3}</div>
                  </div>
                  <div
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    {result.sentence}
                  </div>
                </div>

                {/* <div
                  className="colorBox"
                  // style={{ backgroundColor: result.birth_color }}
                ></div> */}
              </div>
              {/* <div>다시하기</div> */}
              {/* <div onClick={handleBack}>다시하기</div> */}
              <div style={{ position: "absolute", top: "1vh", left: "3vw" }}>
                <button className="buttonStyle" onClick={handleBack}>
                  다시하기
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
