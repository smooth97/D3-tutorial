// input에 아이템 추가 시 firebase 데이터베이스에 추가

const form = document.querySelector("form");
const name = document.querySelector("#name");
const cost = document.querySelector("#cost");
const error = document.querySelector("#error");

const handleSubmit = e => {
  e.preventDefault();
  if (name.value && cost.value) {
    const item = {
      name: name.value,
      cost: parseInt(cost.value)
    };

    db.collection("expenses")
      .add(item)
      .then(res => {
        // item이 들어온다면 아래 코드 실행
        name.value = ""; // 인풋 초기화
        cost.value = "";
      });
  } else {
    error.textContent = "Please enter values before submitting";
  }
};

form.addEventListener("submit", handleSubmit);
