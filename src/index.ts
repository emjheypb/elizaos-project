import {
  type Project,
} from "@elizaos/core";
import eliza from "./agents/eliza";
import professor_oak from "./agents/professor-oak";

const project: Project = {
  agents: [eliza, professor_oak],
};

export default project;
