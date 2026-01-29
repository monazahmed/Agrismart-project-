import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/product.model';
import { connectToDB } from '@/lib/mongoose/connect';

export async function GET(request: NextRequest) {
    try {
        await connectToDB();

        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';
        const sortBy = searchParams.get('sortBy') || 'dateAdded';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');

        // Build filter
        const filter: any = { isAvailable: true };

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
            ];
        }

        if (category && category !== 'all') {
            filter.category = category;
        }

        // Build sort object
        const sortObject: any = {};
        switch (sortBy) {
            case 'price-low':
                sortObject.price = 1;
                break;
            case 'price-high':
                sortObject.price = -1;
                break;
            case 'rating':
                sortObject.rating = -1;
                break;
            case 'newest':
                sortObject.dateAdded = -1;
                break;
            default:
                sortObject.dateAdded = -1;
        }

        const skip = (page - 1) * limit;

        const [products, totalCount] = await Promise.all([
            Product.find(filter)
                .sort(sortObject)
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments(filter),
        ]);

        return NextResponse.json({
            products,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}
