/**
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/**
 * A helper class relations ballerina environment connectors.
 *
 * @class ConnectorHelper
 */
import Environment from './../environment';

class ConnectorHelper {
    /**
     * Gets the connector parameters of a connector
     * @param environment The ballerina environment.
     * @param fullPackageName of the connector
     * @returns {Array}
     */
    static getConnectorParameters(environment, pkgAlias) {
        const connectorParameters = [];
        for (const packageDefintion of environment.getPackages()) {
            if (environment.getPackageByIdentifier(pkgAlias)) {
                const fullPackageName = environment.getPackageByIdentifier(pkgAlias).getName();
                if (packageDefintion.getName() === fullPackageName) {
                    for (const connector of packageDefintion.getConnectors()) {
                        // Get Connection Properties
                        connector.getParams().map((parameter) => {
                            if (parameter.type.startsWith(fullPackageName)) {
                                // const structFields = [];
                                // Get the struct name of the connector
                                const structName = parameter.type.split(':')[1];
                                const optionProps = {
                                    identifier: structName,
                                    bType: 'struct',
                                    value: this.getDefaultValue(parameter.type),
                                    isStruct: true,
                                };
                                connectorParameters.push(optionProps);
                                this.getStructDataFields(fullPackageName,
                                    packageDefintion.getStructDefinitions(), structName, connectorParameters);
                            } else {
                                // Check the bType of each attribute and set the default values accordingly
                                const keyValuePair = {
                                    identifier: parameter.name,
                                    bType: parameter.type,
                                    desc: parameter.name,
                                    value: this.getDefaultValue(parameter.type),
                                    isStruct: false,
                                };
                                connectorParameters.push(keyValuePair);
                            }
                        });
                    }
                    break;
                }
            }
        }
        return connectorParameters;
    }

    /**
     * Get default value
     */
    static getDefaultValue(type) {
        let value;
        switch (type) {
            case 'int':
                value = 0;
                break;
            case 'string':
                value = '';
                break;
            case 'boolean':
                value = false;
                break;
            default:
                value = '';
        }
        return value;
    }

    static getStructDataFields(fullPackageName, structDefinitions, structName, structFields) {
        for (const structDef of structDefinitions) {
            const name = structName.split(':').pop();
            if (structDef.getName() === name) {
                // structFields.push(optionProps);
                structDef.getFields().map((field) => {
                    if (field.getDefaultValue() === undefined) {
                        field.setDefaultValue(this.getDefaultValue(field.getType()));
                    }
                    const keyValuePair = {
                        identifier: structName + ':' + field.getName(),
                        bType: field.getType(),
                        desc: field.getName(),
                        value: this.getDefaultValue(field.getType()),
                        isStruct: true,
                    };
                    structFields.push(keyValuePair);

                    if (field.getType().startsWith(fullPackageName)) {
                        const innerStructName = structName + ':' + field.getType().split(':')[1];
                        this.getStructDataFields(fullPackageName, structDefinitions, innerStructName, structFields);
                    }
                });
            }
        }
        return structFields;
    }
}

export default ConnectorHelper;
