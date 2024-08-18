import React, { useState, useEffect } from 'react';
import './App.css';
import jsonData from './birth_color.json';

function App() {
  const [page, setPage] = useState(0); // 0: 시작 페이지, 1: 입력 페이지, 2: 결과 페이지
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (page === 1) {
      const timeoutId = setTimeout(() => {
        document.querySelector('.inputPageLayout').classList.add('fade-in');
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [page]);

  const isValidDate = (month, day) => {
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);

    if (isNaN(monthNum) || isNaN(dayNum)) return false;
    if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) return false;

    const daysInMonth = [31, (2024 % 4 === 0 && (2024 % 100 !== 0 || 2024 % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return dayNum <= daysInMonth[monthNum - 1];
  };

  const handleSubmit = () => {
    if (!birthMonth || !birthDay) {
      setError('날짜를 입력해 주세요.');
      return;
    }

    if (!isValidDate(birthMonth, birthDay)) {
      setError('유효하지 않은 날짜입니다.');
      return;
    }

    const month = birthMonth.trim() + '월';
    const day = birthDay.trim() + '일';

    const data = jsonData.find(item => item.month === month && item.day === day);

    setResult(data || {
      month: '정보 없음',
      day: '',
      birth_color: '#FFFFFF',
      name: '정보 없음',
      keyword1: '정보 없음',
      keyword2: '정보 없음',
      keyword3: '정보 없음',
      sentence: '정보가 없습니다.'
    });

    setPage(2); // 결과 페이지로 이동
    setError('');
  };

  const handleBack = () => {
    setBirthMonth('');
    setBirthDay('');
    setPage(0); // 시작 페이지로 이동
    setError('');
  };

  const handleNextPage = () => {
    setPage((prevPage) => (prevPage < 4 ? prevPage + 1 : 2));
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => (prevPage > 2 ? 2 : prevPage - 1));
  };

  const getBackgroundClass = () => {
    switch (page) {
      case 0:
        return 'page-0';
      case 1:
        return 'page-1';
      case 2:
        return 'page-2';
      case 3:
        return 'page-2';
      case 4:
        return 'page-2';
      default:
        return 'page-0';
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
    return brightness > 128 ? "#666666" : "#dddddd";
  };

  return (
    <div className={`birthColor ${getBackgroundClass()}`}>
      {page === 0 ? (
        <div className="startPageLayout">
          <div onClick={() => setPage(1)} className='startButton'>Start</div>
        </div>
      ) : page === 1 ? (
        <div className="inputPageLayout">
          <h2>생일을 입력하세요</h2>
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
          <button onClick={handleSubmit}>결과</button>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <div className="resultPageLayout">
          {page === 2 && result && (
            <div>
              <div
                className="colorContentsBox"
                style={{backgroundColor: getContrastingColor(result.birth_color)}}>
                <div
                  className="colorBox"
                  style={{ backgroundColor: result.birth_color }}
                ></div>
                <h3
                style={{color: result.birth_color}}
                >{result.name}</h3>
              </div>
              <button onClick={handleNextPage}>다음</button>
            </div>
          )}
          {page === 3 && result && (
            <div>
              <p className="resultText">키워드: {result.keyword1}, {result.keyword2}, {result.keyword3}</p>
              <button onClick={handlePreviousPage}>이전</button>
              <button onClick={handleNextPage}>다음</button>
            </div>
          )}
          {page === 4 && result && (
            <div>
              <p className="resultText">{result.sentence}</p>
              <button onClick={handlePreviousPage}>이전</button>
              <button onClick={handleBack}>다시하기</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
