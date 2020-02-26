/**
 * @module validators
 * @description
 * Contains validators functions links
 * Provides an information about the order in which validators should be applied
 * Each validator may return true, which means, others will be ignored
 * @see $ref
 */

import required from './required';
import format from './format';
import property from './property';
import type from './type';
import $ref from './$ref';
import not from './not';
import anyOf from './anyOf';
import oneOf from './oneOf';
import allOf from './allOf';
import dependencies from './dependencies';
import properties from './properties';
import patternProperties from './patternProperties';
import items from './items';
import contains from '../validators/contains';
import constant from '../validators/const';
import propertyNames from '../validators/propertyNames';
import { Templater } from '../utils/template';
import { Schema } from '../utils/schema';

export namespace Validators {

  export interface Validator {
    (schema: Schema, tpl: Templater): void;
  }

  export const name = {
    $ref,
    required,
    format,
    property,
    type,
    not,
    anyOf,
    oneOf,
    allOf,
    dependencies,
    properties,
    patternProperties,
    items,
    contains,
    constant,
    propertyNames,
  };

  export const list = [
    $ref,
    required,
    format,
    property,
    type,
    not,
    anyOf,
    oneOf,
    allOf,
    dependencies,
    properties,
    patternProperties,
    items,
    contains,
    constant,
    propertyNames
  ];
  
}