import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { FilterQuery } from 'mongoose';
import Lead, { ILead } from '../models/Lead';
import { sendError, sendSuccess } from '../utils/apiResponse';
import { PaginationMeta } from '../types/common.types';

interface LeadQueryParams {
  page?: string;
  limit?: string;
  status?: string;
  source?: string;
  search?: string;
  sort?: string;
}

const buildLeadFilter = (query: LeadQueryParams): FilterQuery<ILead> => {
  const filter: FilterQuery<ILead> = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.source) {
    filter.source = query.source;
  }

  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filter.$or = [{ name: regex }, { email: regex }];
  }

  return filter;
};

const getSortOption = (sort?: string): Record<string, 1 | -1> => {
  if (sort === 'oldest') {
    return { createdAt: 1 };
  }
  return { createdAt: -1 };
};

export const getLeads = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit as string, 10) || 10)
    );
    const filter = buildLeadFilter(req.query as LeadQueryParams);
    const sort = getSortOption(req.query.sort as string | undefined);

    const total = await Lead.countDocuments(filter);
    const totalPages = Math.ceil(total / limit) || 1;
    const skip = (page - 1) * limit;

    const leads = await Lead.find(filter)
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const pagination: PaginationMeta = {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    sendSuccess(res, leads, 200, undefined, pagination);
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, errors.array()[0].msg, 400);
      return;
    }

    const lead = await Lead.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    sendSuccess(res, lead);
  } catch (error) {
    next(error);
  }
};

export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, errors.array()[0].msg, 400);
      return;
    }

    if (!req.user) {
      sendError(res, 'Not authorized', 401);
      return;
    }

    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user.id,
    });

    const populated = await Lead.findById(lead._id).populate(
      'createdBy',
      'name email'
    );

    sendSuccess(res, populated, 201, 'Lead created successfully');
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, errors.array()[0].msg, 400);
      return;
    }

    if (!req.user) {
      sendError(res, 'Not authorized', 401);
      return;
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    const isOwner = lead.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && !isOwner) {
      sendError(res, 'Access denied', 403);
      return;
    }

    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email');

    sendSuccess(res, updated, 200, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, errors.array()[0].msg, 400);
      return;
    }

    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    sendSuccess(res, null, 200, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const exportLeadsCSV = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filter = buildLeadFilter(req.query as LeadQueryParams);
    const sort = getSortOption(req.query.sort as string | undefined);

    const leads = await Lead.find(filter).sort(sort);

    const header = 'Name,Email,Status,Source,Created At';
    const rows = leads.map((lead) => {
      const createdAt = lead.createdAt.toISOString().split('T')[0];
      const escape = (val: string) =>
        val.includes(',') ? `"${val.replace(/"/g, '""')}"` : val;
      return [
        escape(lead.name),
        escape(lead.email),
        escape(lead.status),
        escape(lead.source),
        createdAt,
      ].join(',');
    });

    const csv = [header, ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};
