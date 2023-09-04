import path from 'path';
import {
    createTypeScriptProject,
    CreateTypeScriptProjectOptions,
    TypeScriptProject,
} from '@mui/monorepo/packages/api-docs-builder/utils/createTypeScriptProject';
import { getComponentFilesInFolder } from './utils';

const workspaceRoot = path.resolve(__dirname, '../../');

export interface XTypeScriptProject extends Omit<TypeScriptProject, 'name'> {
    name: XProjectNames;
    workspaceRoot: string;
    prettierConfigPath: string;
    /**
     * @param {Project} project The project to generate the prop-types from.
     * @returns {string[]} Path to the component files from which we want to generate the prop-types.
     */
    getComponentsWithPropTypes?: (project: XTypeScriptProject) => string[];
    /**
     * @param {Project} project The project to generate the components api from.
     * @returns {string[]} Path to the component files from which we want to generate the api doc.
     */
    getComponentsWithApiDoc?: (project: XTypeScriptProject) => string[];
    /**
     * Name of the folder inside the documentation.
     */
    documentationFolderName: string;
}

export type XProjectNames =
    | 'x-license-pro'
    | 'x-data-grid'
    | 'x-data-grid-pro'
    | 'x-data-grid-premium'
    | 'x-data-grid-generator'
    | 'x-date-pickers'
    | 'x-date-pickers-pro'
    | 'x-charts'
    | 'x-tree-view';

export type XTypeScriptProjects = Map<XProjectNames, XTypeScriptProject>;

interface CreateXTypeScriptProjectOptions
    extends Omit<CreateTypeScriptProjectOptions, 'name'>,
        Pick<
            XTypeScriptProject,
            'name' | 'documentationFolderName' | 'getComponentsWithPropTypes' | 'getComponentsWithApiDoc'
        > {}

const createXTypeScriptProject = (options: CreateXTypeScriptProjectOptions): XTypeScriptProject => {
    const { name, rootPath, tsConfigPath, entryPointPath, files, ...rest } = options;

    const baseProject = createTypeScriptProject({
        name,
        rootPath,
        tsConfigPath,
        entryPointPath,
        files,
    });

    return {
        ...baseProject,
        ...rest,
        name,
        workspaceRoot,
        prettierConfigPath: path.join(workspaceRoot, 'prettier.config.js'),
    };
};

/**
 * Transforms a list of folders and files into a list of file paths containing components.
 * The file must have the name of the component.
 * @param {string[]} folders The folders from which we want to extract components
 * @param {string[]} files The files from which we want to extract components
 */
const getComponentPaths =
    ({
         folders = [],
         files = [],
         includeUnstableComponents = false,
     }: {
        folders?: string[];
        files?: string[];
        includeUnstableComponents?: boolean;
    }) =>
        (project: XTypeScriptProject) => {
            const paths: string[] = [];

            files.forEach((file) => {
                const componentName = path.basename(file).replace('.tsx', '');
                const isExported = !!project.exports[componentName];
                const isHook = path.basename(file).startsWith('use');
                if (isExported && !isHook) {
                    paths.push(path.join(project.rootPath, file));
                }
            });

            folders.forEach((folder) => {
                const componentFiles = getComponentFilesInFolder(path.join(project.rootPath, folder));
                componentFiles.forEach((file) => {
                    const componentName = path.basename(file).replace('.tsx', '');
                    const isExported =
                        !!project.exports[componentName] ||
                        (includeUnstableComponents && !!project.exports[`Unstable_${componentName}`]);
                    const isHook = path.basename(file).startsWith('use');
                    if (isExported && !isHook) {
                        paths.push(file);
                    }
                });
            });

            return paths;
        };

export const getTypeScriptProjects = () => {
    const projects: XTypeScriptProjects = new Map();

    projects.set(
        'x-license-pro',
        createXTypeScriptProject({
            name: 'x-license-pro',
            rootPath: path.join(workspaceRoot, 'packages/x-license-pro'),
            entryPointPath: 'src/index.ts',
            documentationFolderName: 'license',
        }),
    );

    projects.set(
        'x-data-grid',
        createXTypeScriptProject({
            name: 'x-data-grid',
            rootPath: path.join(workspaceRoot, 'packages/grid/x-data-grid'),
            entryPointPath: 'src/index.ts',
            documentationFolderName: 'data-grid',
            getComponentsWithPropTypes: getComponentPaths({
                folders: ['src/components'],
                files: ['src/DataGrid/DataGrid.tsx'],
            }),
            getComponentsWithApiDoc: getComponentPaths({
                files: [
                    'src/DataGrid/DataGrid.tsx',
                    'src/components/panel/filterPanel/GridFilterForm.tsx',
                    'src/components/panel/filterPanel/GridFilterPanel.tsx',
                    'src/components/toolbar/GridToolbarQuickFilter.tsx',
                ],
            }),
        }),
    );

    projects.set(
        'x-data-grid-pro',
        createXTypeScriptProject({
            name: 'x-data-grid-pro',
            rootPath: path.join(workspaceRoot, 'packages/grid/x-data-grid-pro'),
            entryPointPath: 'src/index.ts',
            documentationFolderName: 'data-grid',
            getComponentsWithPropTypes: getComponentPaths({
                folders: ['src/components'],
                files: ['src/DataGridPro/DataGridPro.tsx'],
            }),
            getComponentsWithApiDoc: getComponentPaths({
                files: ['src/DataGridPro/DataGridPro.tsx'],
            }),
        }),
    );

    projects.set(
        'x-data-grid-premium',
        createXTypeScriptProject({
            name: 'x-data-grid-premium',
            rootPath: path.join(workspaceRoot, 'packages/grid/x-data-grid-premium'),
            entryPointPath: 'src/index.ts',
            documentationFolderName: 'data-grid',
            getComponentsWithPropTypes: getComponentPaths({
                folders: ['src/components'],
                files: ['src/DataGridPremium/DataGridPremium.tsx'],
            }),
            getComponentsWithApiDoc: getComponentPaths({
                files: ['src/DataGridPremium/DataGridPremium.tsx'],
            }),
        }),
    );

    projects.set(
        'x-data-grid-generator',
        createXTypeScriptProject({
            name: 'x-data-grid-generator',
            rootPath: path.join(workspaceRoot, 'packages/grid/x-data-grid-generator'),
            documentationFolderName: 'data-grid',
        }),
    );

    projects.set(
        'x-date-pickers',
        createXTypeScriptProject({
            name: 'x-date-pickers',
            rootPath: path.join(workspaceRoot, 'packages/x-date-pickers'),
            entryPointPath: 'src/index.ts',
            documentationFolderName: 'date-pickers',
            getComponentsWithPropTypes: getComponentPaths({
                folders: ['src'],
                includeUnstableComponents: true,
            }),
            getComponentsWithApiDoc: getComponentPaths({
                folders: ['src'],
                includeUnstableComponents: true,
            }),
        }),
    );

    projects.set(
        'x-date-pickers-pro',
        createXTypeScriptProject({
            name: 'x-date-pickers-pro',
            rootPath: path.join(workspaceRoot, 'packages/x-date-pickers-pro'),
            entryPointPath: 'src/index.ts',
            documentationFolderName: 'date-pickers',
            getComponentsWithPropTypes: getComponentPaths({
                folders: ['src'],
                includeUnstableComponents: true,
            }),
            getComponentsWithApiDoc: getComponentPaths({
                folders: ['src'],
                includeUnstableComponents: true,
            }),
        }),
    );

    projects.set(
        'x-charts',
        createXTypeScriptProject({
            name: 'x-charts',
            rootPath: path.join(workspaceRoot, 'packages/x-charts'),
            entryPointPath: 'src/index.ts',
            documentationFolderName: 'charts',
            getComponentsWithPropTypes: getComponentPaths({
                folders: ['src'],
                includeUnstableComponents: true,
            }),
            getComponentsWithApiDoc: getComponentPaths({
                folders: ['src'],
                includeUnstableComponents: true,
            }),
        }),
    );

    projects.set(
        'x-tree-view',
        createXTypeScriptProject({
            name: 'x-tree-view',
            rootPath: path.join(workspaceRoot, 'packages/x-tree-view'),
            entryPointPath: 'src/index.ts',
            documentationFolderName: 'tree-view',
            getComponentsWithPropTypes: getComponentPaths({
                folders: ['src'],
                includeUnstableComponents: true,
            }),
            getComponentsWithApiDoc: getComponentPaths({
                folders: ['src'],
                includeUnstableComponents: true,
            }),
        }),
    );

    return projects;
};
