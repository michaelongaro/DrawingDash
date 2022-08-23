function downloadDrawing(drawingLink, drawingTitle) {
  let url = `${drawingLink}`;
  let xhr = new XMLHttpRequest();
  xhr.responseType = "blob";

  xhr.onload = function () {
    let a = document.createElement("a");
    a.href = window.URL.createObjectURL(xhr.response);
    a.download = `${drawingTitle}.jpeg`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
  };

  xhr.open("GET", url);
  xhr.send();
}

export default downloadDrawing;
