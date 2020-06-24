// import Pomodoro from "./Pomodoro";
import React, { Component } from "react";
// import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as taskActions from "../../store/actions/taskActions";
import * as projectActions from "../../store/actions/projectActions";
import PropTypes from "prop-types";
import TaskSection from "./TaskSection";
import ProjectSection from "./ProjectSection";
import { toast } from "react-toastify";
import Spinner from "../common/Spinner";

class DashboardPage extends Component {
  state = {
    task: {
      title: "",
    },
    project: {
      name: "",
    },
    errors: {},
  };

  componentDidMount() {
    console.log("Dashboard-componentDidMount-->");
    console.log("Errors:", this.state.errors);

    if (this.props.projects.length === 0) {
      this.props.loadProjects();
    }
    console.log("errors local-", this.state.errors);

    if (this.state.errors.onLoad) {
      toast.error(this.state.errors.onLoad, {
        autoClose: 1000,
        hideProgressBar: true,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.errors != this.props.errors) {
      this.setState({ errors: { ...this.props.errors } });
      console.log("Local Errors", this.state.errors);
      // toast.error(this.props.errors.onLoad);
    }
    console.log("Previous Errors", prevProps.errors);
    console.log("Current Errors", this.props.errors);
  }

  handleTaskInputChange = (event) => {
    const task = { ...this.state.task, title: event.target.value };
    this.setState({ task });
  };

  // handle
  handleTaskFormSubmit = (event) => {
    event.preventDefault();
    this.props.createTask(this.state.task);
    const task = { ...this.state.task, title: "" };
    this.setState({ task });
    toast.success("Task Added", { autoClose: 1000, hideProgressBar: true });
  };

  handleProjectFormSubmit = (event) => {
    event.preventDefault();
    // this.props.createProject(this.state.project);
    this.props.saveProject(this.state.project);
    const project = { ...this.state.project, name: "" };
    this.setState({ project });
  };

  handleProjectInputChange = (event) => {
    const project = { ...this.state.project, name: event.target.value };
    this.setState({ project });
    console.log("state object-", this.state);
  };

  render() {
    console.log("Inside render");

    return (
      <div className="container px-0 mt-1 ml-0 px-0 pb-5 h-100">
        <br />
        <br />

        {this.props.isFetching ? (
          <Spinner />
        ) : (
          <div className="row">
            <ProjectSection
              onFormSubmit={this.handleProjectFormSubmit}
              projects={this.props.projects}
              onInputChange={this.handleProjectInputChange}
              value={this.state.project.name}
            />
            <TaskSection
              onFormSubmit={this.handleTaskFormSubmit}
              tasks={this.props.tasks}
              onInputChange={this.handleTaskInputChange}
              value={this.state.task.title}
            />
          </div>
        )}
      </div>
    );
  }
}

DashboardPage.propTypes = {
  createProject: PropTypes.func.isRequired,
  createTask: PropTypes.func.isRequired,
  tasks: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  loadProjects: PropTypes.func.isRequired,
  errors: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  saveProject: PropTypes.func.isRequired,
};

// Mapping State to Props
const mapStateToProps = (state) => {
  // debugger;
  console.log(state.projects);
  return {
    tasks: state.tasks,
    projects: state.projects.list,
    errors: state.projects.errors,
    isFetching: state.projects.isFetching,
  };
};

// Mapping Dispatch to Props
const mapDispatchToProps = {
  createTask: taskActions.createTask,
  loadProjects: projectActions.loadProjects,
  createProject: projectActions.createProject,
  saveProject: projectActions.saveProject,
};

// const mapDispatchToProps = (dispatch) => {
//   debugger;
//   return {
//     taskActions: bindActionCreators(taskActions, dispatch),
//     projectActions: bindActionCreators(projectActions, dispatch),
//   };
// };

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
