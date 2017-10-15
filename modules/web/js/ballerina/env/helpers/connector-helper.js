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
                            let structFields = null;
                            if (parameter.type.startsWith(fullPackageName)) {
                                // Get the struct name of the connector
                                const structName = parameter.type.split(':')[1];
                                for (const structDef of packageDefintion.getStructDefinitions()) {
                                    if (structDef.getName() === structName) {
                                        // Iterate over the struct fields to get their default values
                                        structFields = structDef.getFields();
                                    }
                                }
                                // Set the option name into the attributes
                                const optionProps = {
                                    identifier: 'Options',
                                    bType: 'options',
                                    value: '{}',
                                    fields: structFields,
                                };
                                connectorParameters.push(optionProps);
                                structFields.map((field) => {
                                    if (field.getDefaultValue() === undefined) {
                                        const keyValuePair = {
                                            identifier: 'Options:' + field.getName(),
                                            bType: field.getType(),
                                            desc: field.getName(),
                                            value: this.getDefaultValue(field.getType()),
                                        };
                                        connectorParameters.push(keyValuePair);
                                    }
                                });
                            } else {
                                // Check the bType of each attribute and set the default values accordingly
                                const keyValuePair = {
                                    identifier: parameter.name,
                                    bType: parameter.type,
                                    desc: parameter.name,
                                    value: this.getDefaultValue(parameter.type),
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
            case 'map':
                value = '{}';
                break;
        }
        return value;
    }

}

export default ConnectorHelper;
