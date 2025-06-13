import { type Project } from "@elizaos/core";
import eliza from "./agents/eliza";
import professor_oak from "./agents/professor-oak";
import bookie from "./agents/bookie";

const project: Project = {
  agents: [eliza, professor_oak, bookie],
};

export default project;
