import React, { useEffect } from "react";

const Progress = ({ page = 0 }) => {
  const getWidth = () => {
    // console.log("page", page);
    if (page === 0) return "0%";
    return `${(page / 3) * 100}%`;
  };
  useEffect(() => {
    console.log("getWidth", getWidth());
  }, [page]);
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "50%",
          height: "16px",
          // backgroundColor: "#7ce4ff",

          //   border: "2px solid #444",
          // margin: "40px 0",
          top: "60px",
          // position: "absolute",
        }}
      >
        <div
          style={{
            width: getWidth(),
            //   width: "50%",
            height: "100%",
            backgroundColor: "#7ce4ff",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Progress;
