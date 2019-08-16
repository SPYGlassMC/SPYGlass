import { MarkupContent } from 'vscode-languageserver'

/**
 * Represent a cache which is used to compute completions. 
 */
export default interface GlobalCache {
    advancements: {
        [id: string]: {
            criteria: string[]
        }
    },
    /**
     * Namespaced IDs of recipes.
     */
    recipes: string[],
    lootTables: {
        /**
         * Namespaced IDs of loot tables whose type is `minecraft:advancement_reward`.
         */
        'minecraft:advancement_reward': string[],
        /**
         * Namespaced IDs of loot tables whose type is `minecraft:block`.
         */
        'minecraft:block': string[],
        /**
         * Namespaced IDs of loot tables whose type is `minecraft:chest`.
         */
        'minecraft:chest': string[],
        /**
         * Namespaced IDs of loot tables whose type is `minecraft:empty`.
         */
        'minecraft:empty': string[],
        /**
         * Namespaced IDs of loot tables whose type is `minecraft:entity`.
         */
        'minecraft:entity': string[],
        /**
         * Namespaced IDs of loot tables whose type is `minecraft:fishing`.
         */
        'minecraft:fishing': string[],
        /**
         * Namespaced IDs of loot tables whose type is `minecraft:generic`.
         */
        'minecraft:generic': string[]
    },
    functions: {
        /**
         * The doc-comment of the function.
         */
        [id: string]: MarkupContent | undefined
    },
    blockTags: string[],
    fluidTags: string[],
    functionTags: string[],
    entityTypeTags: string[],
    itemTags?: string[],
    objectives?: string[],
    entities?: string[],
    tags?: string[]
}