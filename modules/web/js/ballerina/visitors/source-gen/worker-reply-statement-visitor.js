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
import _ from 'lodash';
import log from 'log';
import EventChannel from 'event_channel';
import AbstractStatementSourceGenVisitor from './abstract-statement-source-gen-visitor';
import WorkerReplyStatement from '../../ast/statements/worker-reply-statement';

class WorkerReplyStatementVisitor extends AbstractStatementSourceGenVisitor {
    constructor(parent) {
        super(parent);
    }

    canVisitWorkerReplyStatement(workerReplyStatement) {
        return workerReplyStatement instanceof WorkerReplyStatement;
    }

    beginVisitWorkerReplyStatement(workerReplyStatement) {
        this.appendSource(workerReplyStatement.getReplyStatement());
        log.debug('Begin Visit Worker Receive Statement');
    }

    endVisitWorkerReplyStatement(workerReplyStatement) {
        this.getParent().appendSource(this.getGeneratedSource() + ";\n");
        log.debug('End Visit Worker Receive Statement');
    }
}

export default WorkerReplyStatementVisitor;