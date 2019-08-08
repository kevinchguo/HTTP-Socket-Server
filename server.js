const net = require("net");
const files = require("./files.js");

const PORT = 8080;

const server = net.createServer(socket => {
  socket.on("data", chunk => {
    // read incoming data
    console.log("data");
    console.log(chunk.toString());

    // parse the string
    let httpHeader = chunk.toString();
    let url = httpHeader.slice(5, httpHeader.indexOf("H") - 1);
    let date = new Date().toUTCString();
    let fileType = httpHeader.slice(
      httpHeader.indexOf(".") + 1,
      httpHeader.indexOf("H") - 1
    );

    // grab the right file
    let httpResponse;
    if (url === "404.html") {
      url = "URLnotFound";
    } else if (url === "styles.css") {
      fileType = "css";
      url = "styles";
    } else if (typeof url === "string") {
      url = url.slice(0, url.indexOf("."));
    }
    if (files.hasOwnProperty(url)) {
      httpResponse =
        "HTTP/1.1 200 OK\r\n" +
        "Date: " +
        `${date}\r\n` +
        `Content-Type: text/${fileType}; charset=utf-8\r\n` +
        `Content-Length: ${files[url].length}\r\n` +
        "Connection: keep-alive\r\n" +
        "\r\n" +
        files[`${url}`];
    }

    // write outgoing data
    socket.write(httpResponse);
    socket.end();
  });

  socket.on("end", () => {
    // handle client disconnect
    console.log("Client disconnected");
  });

  socket.on("error", err => {
    // handle error in connection
    throw err;
  });
});

server.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
