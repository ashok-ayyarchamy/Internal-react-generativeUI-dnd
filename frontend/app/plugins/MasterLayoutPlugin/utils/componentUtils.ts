import React from "react";
import type { DraggableComponent, ComponentRegistry } from "../interfaces";

/**
 * Recreate component content based on type
 */
export const recreateComponentContent = (
  type: string,
  title: string,
  componentRegistry?: ComponentRegistry
): React.ReactNode => {
  // Find a template component of the same type
  const templateComponent = componentRegistry?.find(
    (comp) => comp.type === type
  );

  if (templateComponent) {
    // Return the content directly since it already has the proper props
    return templateComponent.content;
  }

  // Fallback for unknown component types
  return React.createElement(
    "div",
    {
      style: {
        padding: "20px",
        textAlign: "center",
        color: "#666",
        fontSize: "14px",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
        border: "2px dashed #dee2e6",
      },
    },
    title || `Unknown Component: ${type}`
  );
};

/**
 * Get component by type
 */
export const getComponentByType = (
  type: string,
  componentRegistry?: ComponentRegistry
): DraggableComponent | undefined => {
  return componentRegistry?.find((component) => component.type === type);
};

/**
 * Create a new component instance with unique ID
 */
export const createComponentInstance = (
  type: string,
  title?: string,
  componentRegistry?: ComponentRegistry
): DraggableComponent => {
  const templateComponent = getComponentByType(type, componentRegistry);

  if (templateComponent) {
    return {
      id: `${type}-${Math.floor(Math.random() * 10000)}`,
      type: templateComponent.type,
      title: title || templateComponent.title,
      content: templateComponent.content,
    };
  }

  // Fallback for unknown types
  return {
    id: `${type}-${Math.floor(Math.random() * 10000)}`,
    type,
    title: title || `Unknown Component: ${type}`,
    content: recreateComponentContent(
      type,
      title || `Unknown Component: ${type}`,
      componentRegistry
    ),
  };
};

/**
 * Update component with new type and title
 */
export const updateComponent = (
  component: DraggableComponent,
  newType: string,
  newTitle?: string,
  componentRegistry?: ComponentRegistry
): DraggableComponent => {
  const updatedContent = recreateComponentContent(
    newType,
    newTitle || component.title,
    componentRegistry
  );

  return {
    ...component,
    type: newType,
    title: newTitle || component.title,
    content: updatedContent,
  };
};
