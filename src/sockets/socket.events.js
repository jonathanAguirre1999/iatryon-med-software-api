export function registerSocketEvents(io) {
  io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado:", socket.id);

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });
}
