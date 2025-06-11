import type { Plugin } from "@elizaos/core";
import {
  type Action,
  type Content,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  type Provider,
  type ProviderResult,
  Service,
  type State,
  logger,
} from "@elizaos/core";
import { z } from "zod";

interface ApiResponse {
  id: number;
  name: string;
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  height: number;
  weight: number;
  base_experience: number;
}

/**
 * Define the configuration schema for the plugin with the following properties:
 *
 * @param {string} EXAMPLE_PLUGIN_VARIABLE - The name of the plugin (min length of 1, optional)
 * @returns {object} - The configured schema object
 */
const configSchema = z.object({
  EXAMPLE_PLUGIN_VARIABLE: z
    .string()
    .min(1, "Example plugin variable is not provided")
    .optional()
    .transform((val) => {
      if (!val) {
        console.warn("Warning: Example plugin variable is not provided");
      }
      return val;
    }),
});

/**
 * Example HelloWorld action
 * This demonstrates the simplest possible action structure
 */
/**
 * Represents an action that responds with a simple hello world message.
 *
 * @typedef {Object} Action
 * @property {string} name - The name of the action
 * @property {string[]} similes - The related similes of the action
 * @property {string} description - Description of the action
 * @property {Function} validate - Validation function for the action
 * @property {Function} handler - The function that handles the action
 * @property {Object[]} examples - Array of examples for the action
 */
const action: Action = {
  name: "GET_POKEMON",
  similes: [
    "FETCH_POKEMON",
    "RANDOM_POKEMON",
    "POKEMON_INFO",
    "SHOW_POKEMON",
    "POKEMON_DATA",
  ],
  description:
    "Fetches a random Pokémon from the PokéAPI and displays its number, name, and types",

  validate: async (
    _runtime: IAgentRuntime,
    _message: Memory,
    _state: State
  ): Promise<boolean> => {
    const text = _message.content.text
      ? _message.content.text.toLowerCase()
      : "NO TEXT";

    const triggers = [
      "pokemon",
      "pokémon",
      "random pokemon",
      "get pokemon",
      "show pokemon",
      "fetch pokemon",
    ];

    return triggers.some((trigger) => text.includes(trigger));
  },

  handler: async (
    _runtime: IAgentRuntime,
    _message: Memory,
    _state: State,
    _options: any,
    callback: HandlerCallback,
    _responses: Memory[]
  ) => {
    try {
      const apiUrl = "https://pokeapi.co/api/v2/pokemon";
      const id = Math.floor(Math.random() * 1010) + 1;
      const apiResponse = await fetch(`${apiUrl}/${id}`);

      if (!apiResponse.ok) {
        throw new Error(`Failed to fetch Pokémon: ${apiResponse.status}`);
      }

      const jsonResponse = (await apiResponse.json()) as ApiResponse;

      const data = {
        id: jsonResponse.id,
        name: jsonResponse.name.charAt(0).toUpperCase() + jsonResponse.name.slice(1),
        types: jsonResponse.types.map(
          (typeInfo) =>
            typeInfo.type.name.charAt(0).toUpperCase() +
            typeInfo.type.name.slice(1)
        ),
        height: jsonResponse.height,
        weight: jsonResponse.weight,
        experience: jsonResponse.base_experience,
      };

      const typeString =
        data.types.length > 1
          ? `${data.types.slice(0, -1).join(", ")} and ${data.types.slice(
              -1
            )}`
          : data.types[0];

      const heightInMeters = (data.height / 10).toFixed(1);
      const weightInKg = (data.weight / 10).toFixed(1);

      const message = `🎮 **Pokémon #${data.id}**: **${data.name}**
🏷️ **Type**: ${typeString}
📏 **Height**: ${heightInMeters}m
⚖️ **Weight**: ${weightInKg}kg
⭐ **Base Experience**: ${data.experience}
*Gotta catch 'em all!* ✨`;

      const responseContent: Content = {
        text: message,
        actions: ["GET_POKEMON", "REPLY"],
        source: _message.content.source,
      };

      await callback(responseContent);

      return responseContent;
    } catch (error) {
      logger.error("Error in GET_POKEMON action:", error);
      throw error;
    }
  },

  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "Show me a random Pokémon",
        },
      },
      {
        name: "{{agent}}",
        content: {
          text: "🎮 **Pokémon #345**: **Lileep**\n  \n🏷️ **Type**: Rock and Grass\n📏 **Height**: 1.0m\n⚖️ **Weight**: 23.8kg\n⭐ **Base Experience**: 71\n\n*Gotta catch 'em all!* ✨",
          actions: ['GET_POKEMON', 'REPLY'],
        },
      },
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "get pokemon",
        },
      },
      {
        name: "{{agent}}",
        content: {
          text: "🎮 **Pokémon #779**: **Bruxish**\n  \n🏷️ **Type**: Water and Psychic\n📏 **Height**: 0.9m\n⚖️ **Weight**: 19.0kg\n⭐ **Base Experience**: 166\n\n*Gotta catch 'em all!* ✨",
          actions: ['GET_POKEMON', 'REPLY'],
        },
      },
    ],
  ],
};

/**
 * Example Hello World Provider
 * This demonstrates the simplest possible provider implementation
 */
const provider: Provider = {
  name: "POKEMON_PROVIDER",
  description: "A simple example provider",

  get: async (
    _runtime: IAgentRuntime,
    _message: Memory,
    _state: State
  ): Promise<ProviderResult> => {
    return {
      text: "I am a provider",
      values: {},
      data: {},
    };
  },
};

export class StarterService extends Service {
  static serviceType = "starter";
  capabilityDescription =
    "This is a starter service which is attached to the agent through the pokemon starter plugin.";

  constructor(runtime: IAgentRuntime) {
    super(runtime);
  }

  static async start(runtime: IAgentRuntime) {
    logger.info("*** Starting pokemon starter service ***");
    const service = new StarterService(runtime);
    return service;
  }

  static async stop(runtime: IAgentRuntime) {
    logger.info("*** Stopping pokemon starter service ***");
    // get the service from the runtime
    const service = runtime.getService(StarterService.serviceType);
    if (!service) {
      throw new Error("Pokemon starter service not found");
    }
    service.stop();
  }

  async stop() {
    logger.info("*** Stopping pokemon starter service instance ***");
  }
}

const plugin: Plugin = {
  name: "pokemon_starter",
  description: "A starter plugin for Eliza",
  config: {
    EXAMPLE_PLUGIN_VARIABLE: process.env.EXAMPLE_PLUGIN_VARIABLE,
  },
  async init(config: Record<string, string>) {
    logger.info("*** Initializing pokemon starter plugin ***");
    try {
      const validatedConfig = await configSchema.parseAsync(config);

      // Set all environment variables at once
      for (const [key, value] of Object.entries(validatedConfig)) {
        if (value) process.env[key] = value;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Invalid plugin configuration: ${error.errors.map((e) => e.message).join(", ")}`
        );
      }
      throw error;
    }
  },
  services: [StarterService],
  actions: [action],
  providers: [provider],
};

export default plugin;
