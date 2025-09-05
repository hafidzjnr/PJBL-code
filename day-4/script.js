document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addTaskButton = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');

  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !=="") {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${taskText}</span>
        <button class="delete-button">Hapus</button>
      `;
      taskList.appendChild(li);
      taskInput.value = "";//bersihkan input field

      //menambahkan event listener untuk manandai tugas selesai
      li.querySelector('span').addEventListener('click', ()=> {
        li.classList.toggle('done');
      });

      //menambahkan event listener untuk menghapus tugas
      li.querySelector('.delete-button').addEventListener('click', () => {
        taskList.removeChild(li);
      });
    }
  }

  //menambahkan event listener untuk tombol tambah tugas
  addTaskButton.addEventListener('click', addTask);

  //menmbahkan tugas saat tombol enter ditekan
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  });
});