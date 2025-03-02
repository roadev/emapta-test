import { Request, Response, NextFunction, RequestHandler } from "express";
import { MappingModel, IMapping } from "../models/mapping";

export const createMapping: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const { ehr, mapping } = req.body;
        if (!ehr || !mapping) {
            res.status(400).json({ error: "ehr and mapping fields are required" });
            return;
        }

        const existingMapping = await MappingModel.findOne({ ehr });
        if (existingMapping) {
            res.status(409).json({ error: `Mapping for EHR "${ehr}" already exists.` });
            return;
        }

        const newMapping: IMapping = new MappingModel({ ehr, mapping });
        await newMapping.save();
        res.status(201).json(newMapping);
    } catch (error: any) {
        next(error);
    }
};

export const getMapping: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const { ehr } = req.params;
        const mapping = await MappingModel.findOne({ ehr });
        if (!mapping) {
            res.status(404).json({ error: "Mapping not found" });
            return;
        }
        res.status(200).json(mapping);
    } catch (error) {
        next(error);
    }
};

export const getAllMappings: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const mappings = await MappingModel.find({});
        res.status(200).json(mappings);
    } catch (error) {
        next(error);
    }
};

export const updateMapping: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const { ehr } = req.params;
        const updateData = req.body;
        const mapping = await MappingModel.findOneAndUpdate({ ehr }, updateData, { new: true });
        if (!mapping) {
            res.status(404).json({ error: "Mapping not found" });
            return;
        }
        res.status(200).json(mapping);
    } catch (error) {
        next(error);
    }
};

export const deleteMapping: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const { ehr } = req.params;
        const mapping = await MappingModel.findOneAndDelete({ ehr });
        if (!mapping) {
            res.status(404).json({ error: "Mapping not found" });
            return;
        }
        res.status(200).json({ message: "Mapping deleted successfully" });
    } catch (error) {
        next(error);
    }
};
