// Register Page


// Formats the phone number on register page
const formatTel = () => {
  let phoneNum = document.getElementById("phone");

  if (phoneNum.value.length < 10) {
    alert("Please enter a phone number with more digits.")
  } else if (phoneNum.value.length > 14) {
    alert("Please enter a phone number with less digits, or characters.");
  } else if (phoneNum.value.length > 9 && phoneNum.value.length < 15) {
    phoneNum.value = phoneNum.value.replace(/[^0-9]/g, '');
    phoneNum.value = phoneNum.value.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }
};
