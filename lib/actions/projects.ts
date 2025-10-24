"use server";

import { prisma } from "@/lib/prisma";

/**
 * Project Actions
 *
 * Server actions for managing projects and their data
 */

export const getProjectsByUserId = async (userId: string) => {
  const projects = await prisma.project.findMany({
    where: {
      userId,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          documents: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!projects) return null;

  return projects;
};

export const getProjectsByClientId = async (clientId: string) => {
  const projects = await prisma.project.findMany({
    where: {
      clientId,
    },
    include: {
      _count: {
        select: {
          documents: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!projects) return null;

  return projects;
};

export const getProjectById = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      client: true,
      documents: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!project) return null;

  return project;
};

export const createProject = async (data: {
  userId: string;
  clientId: string;
  title: string;
  description?: string;
}) => {
  const project = await prisma.project.create({
    data: {
      userId: data.userId,
      clientId: data.clientId,
      title: data.title,
      description: data.description || null,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return project;
};

export const updateProject = async (
  projectId: string,
  data: {
    title?: string;
    description?: string | null;
    isActive?: boolean;
  }
) => {
  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      title: data.title,
      description: data.description,
      isActive: data.isActive,
    },
  });

  return project;
};

export const deleteProject = async (projectId: string) => {
  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  return { success: true };
};

export const archiveProject = async (projectId: string) => {
  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      isActive: false,
    },
  });

  return project;
};

export const unarchiveProject = async (projectId: string) => {
  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      isActive: true,
    },
  });

  return project;
};
