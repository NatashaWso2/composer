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

import Node from '../node';
import _ from 'lodash';

class AnnotationAttachmentAttributeValueNodeAbstract extends Node {


    setValueArray(newValue, silent, title) {
        let oldValue = this.valueArray;
        title = (_.isNil(title)) ? `Modify ${this.kind}` : title;
        this.valueArray = newValue;

        if(!silent) {
            this.trigger('tree-modified', {
                origin: this,
                type: 'modify-node',
                title,
                data: {
                    attributeName: 'valueArray',
                    newValue,
                    oldValue,
                }
            });
        }
    }

    getValueArray() {
        return this.valueArray;
    }


    addValueArray(node, i = -1, silent){
        node.parent = this;
        let index = i;
        if (i === -1) {
            this.valueArray.push(node);
            index = this.valueArray.length;
        } else {
            this.valueArray.splice(i, 0, node);
        }
        if(!silent) {
            this.trigger('tree-modified', {
                origin: this,
                type: 'child-added',
                title: `Add ${node.kind}`,
                data: {
                    node,
                    index,
                },
            });
        }
    }

    removeValueArray(node, silent){
        const index = this.getIndexOfValueArray(node);
        this.removeValueArrayByIndex(index);
        if(!silent) {
            this.trigger('tree-modified', {
                origin: this,
                type: 'child-removed',
                title: `Removed ${node.kind}`,
                data: {
                    node,
                    index,
                },
            });
        }        
    }

    removeValueArrayByIndex(index, silent){
        this.valueArray.splice(index, 1);
        if(!silent) {
            this.trigger('tree-modified', {
                origin: this,
                type: 'child-removed',
                title: `Removed ${node.kind}`,
                data: {
                    node,
                    index,
                },
            });
        }
    }

    replaceValueArray(oldChild, newChild, silent){
        const index = this.getIndexOfValueArray(oldChild);
        this.valueArray[index] = newChild;
    }

    getIndexOfValueArray(child){
        return _.findIndex(this.valueArray, ['id', child.id]);
    }

    filterValueArray(predicateFunction){
        return _.filter(this.valueArray, predicateFunction);
    }


    setValue(newValue, silent, title) {
        let oldValue = this.value;
        title = (_.isNil(title)) ? `Modify ${this.kind}` : title;
        this.value = newValue;

        this.value.parent = this;

        if(!silent) {
            this.trigger('tree-modified', {
                origin: this,
                type: 'modify-node',
                title,
                data: {
                    attributeName: 'value',
                    newValue,
                    oldValue,
                }
            });
        }
    }

    getValue() {
        return this.value;
    }



    setWS(newValue, silent, title) {
        let oldValue = this.wS;
        title = (_.isNil(title)) ? `Modify ${this.kind}` : title;
        this.wS = newValue;

        if(!silent) {
            this.trigger('tree-modified', {
                origin: this,
                type: 'modify-node',
                title,
                data: {
                    attributeName: 'wS',
                    newValue,
                    oldValue,
                }
            });
        }
    }

    getWS() {
        return this.wS;
    }



    setKind(newValue, silent, title) {
        let oldValue = this.kind;
        title = (_.isNil(title)) ? `Modify ${this.kind}` : title;
        this.kind = newValue;

        if(!silent) {
            this.trigger('tree-modified', {
                origin: this,
                type: 'modify-node',
                title,
                data: {
                    attributeName: 'kind',
                    newValue,
                    oldValue,
                }
            });
        }
    }

    getKind() {
        return this.kind;
    }



    setPosition(newValue, silent, title) {
        let oldValue = this.position;
        title = (_.isNil(title)) ? `Modify ${this.kind}` : title;
        this.position = newValue;

        if(!silent) {
            this.trigger('tree-modified', {
                origin: this,
                type: 'modify-node',
                title,
                data: {
                    attributeName: 'position',
                    newValue,
                    oldValue,
                }
            });
        }
    }

    getPosition() {
        return this.position;
    }



}

export default AnnotationAttachmentAttributeValueNodeAbstract;