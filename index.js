const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3200;

app.use(bodyParser.json());
app.use(cors());

// Estrutura base
const data = {
  user: {
    id: 1,
    name: "Bruno Azevedo",
  },
  projects: [
    {
      id: 1,
      title: "Project ABC",
      description: "Join the future of insurance",
      status: "active",
      tasks: [
        {
          id: 1,
          title: "task 01",
          description: "bolttech is an insurtech like no other",
          status: "ToDo",
          link: "",
        },
        {
          id: 2,
          title: "task 02",
          description: "With an international footprint spanning ",
          status: "Done",
          link: "",
        },
      ],
    },
    {
      id: 2,
      title: "Project XYZ",
      description: "Partner with us",
      status: "active",
      tasks: [
        {
          id: 1,
          title: "task 01",
          description: "Multiplying the opportunities for everyone",
          status: "ToDo",
          link: "",
        },
        {
          id: 2,
          title: "task 02",
          description: "By providing relevant protection and insurance",
          status: "Done",
          link: "",
        },
      ],
    },
  ],
};

//Retornamos o objeto por inteiro
app.get("/data", (req, res) => {
  res.json(data);
});

//Pecorremos todo o projeto para ir pegando todas as tarefas
app.get("/tasks", (req, res) => {
  const tasks = data.projects.reduce((acc, project) => {
    //acc -> acumulador, project -> info atual que estamos passando
    return acc.concat(project.tasks);
  }, []);
  res.json(tasks);
});

app.post("/projects/:projectId/tasks", (req, res) => {
  const { projectId } = req.params;
  const { title, description, status, link } = req.body;

  const project = data.projects[projectId - 1];
  if (project) {
    const newTask = {
      id: project.tasks.length + 1,
      title,
      description,
      status,
      link,
    };
    project.tasks.push(newTask);
    res.status(201).json(newTask);
  } else {
    res.status(404).json({ message: "Project not found" });
  }
});

app.put("/tasks/:projectId/:taskId", (req, res) => {
  const { projectId, taskId } = req.params;
  const { title, description, status, link } = req.body;
  const project = data.projects[projectId - 1]; // Com base no valor do projectId ele Subtrai 1 do projectId para ajustar o índice de array
  const task = project.tasks[taskId - 1];
  if (task && task.status !== "Done") {
    task.title = title;
    task.description = description;
    task.status = status;
    task.link = link;
    res.json(task);
  } else if (task && task.status === "Done") {
    res.status(400).json({ message: "Task não pode ser mais alterada" });
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

app.delete("/tasks/:projectId/:taskId", (req, res) => {
  const { projectId, taskId } = req.params;
  const project = data.projects[projectId - 1];
  if (project && project.tasks[taskId - 1]) {
    project.tasks.splice(taskId - 1, 1);
    res.json({ message: "Task removida com sucesso" });
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
